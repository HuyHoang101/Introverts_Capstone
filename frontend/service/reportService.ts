// service/reportService.ts
import * as reportApi from "@/lib/reportApi";

export const addReport = async (report: any) => {
  return reportApi.request('/', {
    method: 'POST',
    body: JSON.stringify(report),
  });
};
