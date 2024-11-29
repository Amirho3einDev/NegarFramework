
// تعریف اینترفیس State گرید
export default interface GridState {
    data: any[];
    filters: { [key: string]: { operator: string; value: string } };
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    showDialog: boolean; // نمایش یا مخفی بودن دیالوگ
  }