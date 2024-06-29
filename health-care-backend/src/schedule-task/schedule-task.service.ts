import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreatmentScheduleEntity } from '../entities/treatment.schedule.entity';
import { Between, Repository } from 'typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { MessengerService } from '../messenger/messenger.service';
import { TelegramService } from '../messenger/impl/telegram.service';

@Injectable()
export class ScheduleTaskService implements OnModuleInit {
  private readonly logger = new Logger(ScheduleTaskService.name);
  private readonly tasks = new Map<string, CronJob>();

  constructor(
    @InjectRepository(TreatmentScheduleEntity) // Используйте свою сущность для расписания
    private readonly scheduleRepository: Repository<TreatmentScheduleEntity>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly messengerService: MessengerService,
    private readonly telegramService: TelegramService,
  ) {
    this.telegramService.registerScheduleTaskService(this);
  }

  async onModuleInit() {
    await this.scheduleDailyTaskUpdate();
    await this.updateTasksForRestOfDay(); // Добавляем задачи для оставшейся части текущего дня
  }

  async scheduleDailyTaskUpdate() {
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    midnight.setDate(midnight.getDate() + 1);

    const dailyUpdateJob = new CronJob(midnight, async () => {
      await this.updateTasksForNextDay();
      this.scheduleDailyTaskUpdate(); // Планируем следующую задачу обновления
    });

    this.schedulerRegistry.addCronJob('dailyUpdateJob', dailyUpdateJob);
    dailyUpdateJob.start();
  }

  async updateTasksForNextDay() {
    this.logger.log('Updating tasks for the next day');

    // Удаляем текущие задачи
    this.tasks.forEach((job, name) => {
      job.stop();
      this.schedulerRegistry.deleteCronJob(name);
    });
    this.tasks.clear();

    // Получаем расписание на следующий день
    const now = new Date();
    const startOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
    );
    const endOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 2,
      0,
      0,
      0,
    );

    const schedules = await this.scheduleRepository.find({
      where: {
        send_date: Between(startOfTomorrow, endOfTomorrow),
      },
    });

    schedules.forEach((schedule) => {
      this.addTask(schedule);
    });
  }

  async updateTasksForRestOfDay() {
    this.logger.log('Updating tasks for the rest of the day');

    // Получаем расписание на оставшуюся часть текущего дня
    const now = new Date();

    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
    );
    // todo: remove
    now.setDate(now.getDate() - 1);
    const schedules = await this.scheduleRepository.find({
      where: {
        send_date: Between(now, endOfToday),
      },
    });
    const now_test = new Date();
    [schedules[0], schedules[1]].forEach((schedule) => {
      now_test.setSeconds(now_test.getSeconds() + 5);
      schedule.send_date = now_test;
      this.addTask(schedule);
    });
  }

  addTask(schedule: TreatmentScheduleEntity) {
    const name = `task-${schedule.id}`;
    const job = new CronJob(schedule.send_date, () => {
      this.logger.log(`Executing task: ${name}`, JSON.stringify(schedule));
      this.messengerService
        .sendTreatment(schedule)
        .then(() => this.logger.log('ok'))
        .catch(() => this.logger.error('fail'));
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    this.tasks.set(name, job);
    this.logger.log(`Task ${name} added for ${schedule.send_date}`);
  }

  getTasks() {
    return Array.from(this.tasks.keys());
  }
}
