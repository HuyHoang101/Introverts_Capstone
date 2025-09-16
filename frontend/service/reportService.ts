import { addReport as addReportApi, AddReportPayload } from '@/lib/reportApi';

export async function addReport(payload: AddReportPayload) {
  return addReportApi(payload); // giữ nguyên shape
}
