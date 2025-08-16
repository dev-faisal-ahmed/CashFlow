export class PaginationHelper {
  constructor(
    private page: number = 1,
    private limit: number = 10,
    private getAll: boolean = false,
  ) {
    this.page = page;
    this.limit = limit;
    this.getAll = getAll;
  }

  getPaginationInfo() {
    return { skip: (this.page - 1) * this.limit, getAll: this.getAll, limit: this.limit };
  }

  getMeta(count: number) {
    const totalPage = Math.ceil(count / this.limit);
    return { page: this.page, limit: this.limit, total: count, totalPage };
  }
}
