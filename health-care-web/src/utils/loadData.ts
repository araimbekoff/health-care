import { MedicalReportDto } from 'src/types/medicine-dto';
import { api } from 'boot/axios';

export async function loadData(jsonFileName: string): Promise<MedicalReportDto> {
  try {
    const response = await fetch(`/src/fakes/${jsonFileName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as MedicalReportDto;
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    throw error;
  }
}

export const loadPatentData = async (file_name: string) => {
  const res = await api.get<MedicalReportDto>(`fakes/${file_name}`);
  console.log(res, file_name);
  return res.data;
};

