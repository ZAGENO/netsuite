const inventoryitem = 'inventoryitem';
const purchaseorder = 'purchaseorder';

function create_inventory_item(item) {
  var record = nlapiCreateRecord(inventoryitem);
  for (var fieldname in item)
  {
    if (item.hasOwnProperty(fieldname))
    {
      var value = item[fieldname];
      if (value && typeof value != 'object')
      {
        record.setFieldValue(fieldname, value);
      }
    }
  }
  var recordId = nlapiSubmitRecord(record);
  nlapiLogExecution('DEBUG','id='+recordId);
  return nlapiLoadRecord(inventoryitem, recordId);
}

function get_item(item) {
  var filters = new Array();
  filters[0] = new nlobjSearchFilter('itemid', null, 'contains', item.itemid, null);
  var searchresults = nlapiSearchRecord(inventoryitem, null, filters, null);

  if (searchresults !== null && searchresults.length===1) {
    return nlapiLoadRecord(inventoryitem, searchresults[0].getId());
  }
  else {
    return create_inventory_item(item);
  }
}

function addItem(record, item) {
  item = get_item(item);
  record.selectNewLineItem('item');
  record.setCurrentLineItemValue('item','item', item.getId());
  record.commitLineItem('item');
}


function POST(data) {
  var record = nlapiCreateRecord(purchaseorder);
  var item;
  for (var index in data.items) {
    item = data.items[index];
    addItem(record, item);
  }

  for (var fieldname in data)
  {
    if (data.hasOwnProperty(fieldname))
      {
        if (fieldname != 'recordtype' && fieldname != 'id' && fieldname != 'items')
        {
          var value = data[fieldname];
          if (value && typeof value != 'object') // ignore other type of parameters
            {
              record.setFieldValue(fieldname, value);
            }
         }
     }
  }
  var recordId = nlapiSubmitRecord(record);
  nlapiLogExecution('DEBUG','id='+recordId);

  return nlapiLoadRecord(purchaseorder, recordId);
}

function DELETE(data) {
  nlapiDeleteRecord(purchaseorder, data.id);
}
