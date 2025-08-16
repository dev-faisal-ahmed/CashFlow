export class PaginationHelper {
  constructor(
    private page: number,
    private limit: number,
    private getAll: boolean,
  ) {
    this.page = page;
    this.limit = limit;
    this.getAll = getAll;
  }

  getPaginationInfo() {
    return { skip: (this.page - 1) * this.limit, getAll: this.getAll };
  }

  getMeta(count: number) {
    const totalPage = Math.ceil(count / this.limit);
    return { page: this.page, limit: this.limit, total: count, totalPage };
  }
}
