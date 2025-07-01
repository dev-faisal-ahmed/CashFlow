import { TMeta } from './common/dto/response.dto';
import { TQueryParams } from './common/types';

export const capitalize = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getPaginationInfo = (query: TQueryParams) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const getAll = query.getAll === 'true';
  const skip = (page - 1) * limit;

  return { page, limit, skip, getAll };
};

export const getMeta = ({ page, limit, total }: Pick<TMeta, 'page' | 'limit' | 'total'>): TMeta => {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
};

export const selectFields = (fields: string) => {
  if (!fields) return null;
  return fields.split(',').reduce((acc, value) => {
    acc[value] = 1;
    return acc;
  }, {});
};
