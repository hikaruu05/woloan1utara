/**
 * Public, read-only catalog endpoint for the Woloan portal.
 * Bind this Apps Script project to the catalog spreadsheet and deploy as a web app.
 * There is intentionally no doPost handler: public visitors cannot change content.
 */
function doGet(event) {
  const callback = String((event && event.parameter && event.parameter.callback) || '');
  if (!/^[$A-Z_a-z][$\w]{0,80}$/.test(callback)) {
    return ContentService.createTextOutput('/* Invalid callback */')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  const catalog = {
    houses: getPublishedRows_('Houses').map(toHouse_),
    umkmStores: getPublishedRows_('Stores').map(toStore_),
  };
  const products = getPublishedRows_('Products');
  catalog.umkmStores.forEach((store) => {
    store.products = products
      .filter((product) => product.storeId === store.id)
      .map(toProduct_);
  });

  return ContentService.createTextOutput(callback + '(' + JSON.stringify(catalog) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function getPublishedRows_(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];

  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0].map((header) => String(header).trim());
  return values.slice(1)
    .filter((row) => row.some((cell) => String(cell).trim() !== ''))
    .map((row) => headers.reduce((record, header, index) => {
      record[header] = String(row[index] || '').trim();
      return record;
    }, {}))
    .filter((record) => record.status.toLowerCase() === 'published' && record.id);
}

function splitList_(value) {
  return String(value || '').split('|').map((item) => item.trim()).filter(Boolean);
}

function integer_(value) {
  const parsed = Number(String(value || '').replace(/[^0-9-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function boolean_(value) {
  return ['true', 'yes', '1', 'ya'].includes(String(value || '').trim().toLowerCase());
}

function toHouse_(row) {
  return {
    id: row.id,
    title: row.title,
    type: row.type || 'tradisional',
    dimensions: row.dimensions,
    woodTypes: splitList_(row.woodTypes),
    bedrooms: integer_(row.bedrooms),
    bathrooms: integer_(row.bathrooms),
    floors: integer_(row.floors) || 1,
    priceEstimated: row.priceEstimated,
    minBudget: integer_(row.minBudget),
    craftsmanName: row.craftsmanName,
    craftsmanPhone: row.craftsmanPhone,
    craftsmanAddress: row.craftsmanAddress,
    mapsUrl: row.mapsUrl || undefined,
    description: row.description,
    features: splitList_(row.features),
    imageUrl: row.imageUrl,
    galleryUrls: splitList_(row.galleryUrls || row.imageUrl),
    isVerified: true,
    isCustomAllowed: boolean_(row.isCustomAllowed),
    createdAt: row.createdAt,
  };
}

function toStore_(row) {
  return {
    id: row.id,
    name: row.name,
    ownerName: row.ownerName,
    category: row.category || 'lainnya',
    phone: row.phone,
    address: row.address,
    mapsUrl: row.mapsUrl || undefined,
    description: row.description,
    imageUrl: row.imageUrl,
    badge: row.badge,
    isVerified: true,
    createdAt: row.createdAt,
    products: [],
  };
}

function toProduct_(row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    priceNum: integer_(row.priceNum),
    unit: row.unit,
    description: row.description,
    imageUrl: row.imageUrl,
  };
}
