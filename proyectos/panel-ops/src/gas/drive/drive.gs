/**
 * INF-003 — Drive case-file automation.
 * Root `/WOOD_PANEL_OPERATIONS`, customer folders under `01_CUSTOMERS`, per-order
 * folder trees with subfolders 00-07 (architecture.md §5, data-model.md#Documents).
 * Folder 00-07 names mirror the Documents.category enum order exactly:
 * original_request, normalized, confirmation, quotation, payment, production,
 * delivery, closure — confirmed against roadmap.md's explicit anchors for
 * 00_ORIGINAL_REQUEST, 03_QUOTATION, 04_PAYMENT, 05_PRODUCTION, 07_CLOSURE.
 * Nothing in 00_ORIGINAL_REQUEST is ever overwritten or deleted (write-once).
 */

var PANEL_OPS_DRIVE_ROOT_PROP = 'PANEL_OPS_DRIVE_ROOT_ID';
var PANEL_OPS_DRIVE_ROOT_NAME = 'WOOD_PANEL_OPERATIONS';
var PANEL_OPS_DRIVE_CUSTOMERS_FOLDER = '01_CUSTOMERS';

var PANEL_OPS_ORDER_SUBFOLDERS = [
  { category: 'original_request', name: '00_ORIGINAL_REQUEST' },
  { category: 'normalized', name: '01_NORMALIZED' },
  { category: 'confirmation', name: '02_CONFIRMATION' },
  { category: 'quotation', name: '03_QUOTATION' },
  { category: 'payment', name: '04_PAYMENT' },
  { category: 'production', name: '05_PRODUCTION' },
  { category: 'delivery', name: '06_DELIVERY' },
  { category: 'closure', name: '07_CLOSURE' }
];

var drive = {
  /**
   * Finds or creates the platform root folder. Idempotent: caches the id in
   * Script Properties (mirrors PANEL_OPS_SS_ID_PROP in core/db.gs) so repeat
   * calls never create duplicate roots even if the property is stale.
   */
  ensureRoot: function () {
    var props = PropertiesService.getScriptProperties();
    var cachedId = props.getProperty(PANEL_OPS_DRIVE_ROOT_PROP);
    if (cachedId) {
      try {
        var cached = DriveApp.getFolderById(cachedId);
        return cached;
      } catch (e) {
        // stale property (folder deleted/moved out of reach) — fall through and re-resolve
      }
    }

    var root = findOrCreateFolder_(DriveApp.getRootFolder(), PANEL_OPS_DRIVE_ROOT_NAME);
    props.setProperty(PANEL_OPS_DRIVE_ROOT_PROP, root.getId());
    return root;
  },

  /**
   * Creates (or returns existing) folder tree for one order:
   * root/01_CUSTOMERS/<customerName>/<ticketId>/00_ORIGINAL_REQUEST..07_CLOSURE
   */
  createOrderFolders: function (ticketId, customerName) {
    if (!ticketId) {
      throw new Error('createOrderFolders requires ticketId');
    }
    if (!customerName) {
      throw new Error('createOrderFolders requires customerName');
    }

    var root = drive.ensureRoot();
    var customersRoot = findOrCreateFolder_(root, PANEL_OPS_DRIVE_CUSTOMERS_FOLDER);
    var customerFolder = findOrCreateFolder_(customersRoot, customerName);
    var orderFolder = findOrCreateFolder_(customerFolder, ticketId);

    var subfolders = {};
    PANEL_OPS_ORDER_SUBFOLDERS.forEach(function (spec) {
      subfolders[spec.category] = findOrCreateFolder_(orderFolder, spec.name);
    });

    return {
      customerFolder: customerFolder,
      orderFolder: orderFolder,
      subfolders: subfolders
    };
  },

  /**
   * Stores blob into the order's per-category subfolder, writes a Documents
   * row, and enforces write-once on category `original_request`.
   */
  storeFile: function (ticketId, category, blob, meta) {
    if (!ticketId) {
      throw new Error('storeFile requires ticketId');
    }
    var subfolderSpec = getSubfolderSpecForCategory_(category);
    if (!subfolderSpec) {
      throw new Error('Unknown Documents category: ' + category);
    }

    var orderFolder = findOrderFolder_(ticketId);
    if (!orderFolder) {
      throw new Error('No order folder found for ticket ' + ticketId + ' — call drive.createOrderFolders first');
    }
    var subfolder = findOrCreateFolder_(orderFolder, subfolderSpec.name);

    var isImmutableCategory = category === 'original_request';
    if (isImmutableCategory && subfolder.getFiles().hasNext()) {
      throw new Error('Rejected: ' + subfolderSpec.name + ' is write-once — a file already exists for ticket ' + ticketId);
    }

    var filename = buildStoredFilename_(ticketId, category, blob.getName());
    var file = subfolder.createFile(blob.setName(filename));

    var record = db.insert('Documents', {
      ticket_id: ticketId,
      customer_id: (meta && meta.customerId) || '',
      category: category,
      filename: filename,
      drive_file_id: file.getId(),
      drive_url: file.getUrl(),
      immutable: isImmutableCategory,
      uploaded_by: (meta && meta.actor) || 'system',
      uploaded_at: new Date().toISOString()
    }, meta);

    return record;
  }
};

function getSubfolderSpecForCategory_(category) {
  for (var i = 0; i < PANEL_OPS_ORDER_SUBFOLDERS.length; i++) {
    if (PANEL_OPS_ORDER_SUBFOLDERS[i].category === category) {
      return PANEL_OPS_ORDER_SUBFOLDERS[i];
    }
  }
  return null;
}

function buildStoredFilename_(ticketId, category, originalName) {
  return ticketId + '_' + category + '_' + originalName;
}

function findOrCreateFolder_(parent, name) {
  var existing = parent.getFoldersByName(name);
  if (existing.hasNext()) {
    return existing.next();
  }
  return parent.createFolder(name);
}

/**
 * Locates an order's folder by exact name match under
 * root/01_CUSTOMERS/*\/<ticketId>. Ticket IDs are opaque, server-generated,
 * and never reused (architecture.md §6 invariant 10), so an exact-name
 * search is unambiguous.
 */
function findOrderFolder_(ticketId) {
  var root = drive.ensureRoot();
  var customersRoot = findOrCreateFolder_(root, PANEL_OPS_DRIVE_CUSTOMERS_FOLDER);
  var customerFolders = customersRoot.getFolders();
  while (customerFolders.hasNext()) {
    var customerFolder = customerFolders.next();
    var orderFolders = customerFolder.getFoldersByName(ticketId);
    if (orderFolders.hasNext()) {
      return orderFolders.next();
    }
  }
  return null;
}
