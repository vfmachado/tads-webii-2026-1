export enum ProductCategory {
  ELETRONICOS = 'ELETRONICOS',
  MODA_E_ACESSORIOS = 'MODA_E_ACESSORIOS',
  CASA_E_DECORACAO = 'CASA_E_DECORACAO',
  ESPORTES_E_LAZER = 'ESPORTES_E_LAZER',
  LIVROS_E_MIDIA = 'LIVROS_E_MIDIA',
  BELEZA_E_CUIDADOS = 'BELEZA_E_CUIDADOS',
  INFANTIL = 'INFANTIL',
  COLECIONAVEIS = 'COLECIONAVEIS',
}

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.ELETRONICOS]: 'Eletronicos',
  [ProductCategory.MODA_E_ACESSORIOS]: 'Moda e acessorios',
  [ProductCategory.CASA_E_DECORACAO]: 'Casa e decoracao',
  [ProductCategory.ESPORTES_E_LAZER]: 'Esportes e lazer',
  [ProductCategory.LIVROS_E_MIDIA]: 'Livros e midia',
  [ProductCategory.BELEZA_E_CUIDADOS]: 'Beleza e cuidados',
  [ProductCategory.INFANTIL]: 'Infantil',
  [ProductCategory.COLECIONAVEIS]: 'Colecionaveis',
};

export const PRODUCT_CATEGORIES = Object.values(ProductCategory);

export const PRODUCT_CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map((value) => ({
  value,
  label: PRODUCT_CATEGORY_LABELS[value],
}));

function normalizeCategoryTerm(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/_/g, ' ')
    .trim();
}

export function isProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.includes(value as ProductCategory);
}

export function getProductCategoryLabel(category: string) {
  return isProductCategory(category) ? PRODUCT_CATEGORY_LABELS[category] : category;
}

export function findMatchingProductCategories(search: string) {
  const normalizedSearch = normalizeCategoryTerm(search);

  if (!normalizedSearch) {
    return [];
  }

  return PRODUCT_CATEGORY_OPTIONS
    .filter(({ value, label }) => {
      const normalizedValue = normalizeCategoryTerm(value);
      const normalizedLabel = normalizeCategoryTerm(label);

      return normalizedValue.includes(normalizedSearch) || normalizedLabel.includes(normalizedSearch);
    })
    .map(({ value }) => value);
}
