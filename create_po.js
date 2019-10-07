const inventoryitem = 'inventoryitem';
const purchaseorder = 'purchaseorder';

function GET(datain) {
    datain = JSON.parse(datain);
    return JSON.stringify(nlapiLoadRecord(datain.recordtype, datain.id));
}

function updateFieldValues(record, item) {
  // Pass empty list in exclusionList if there is nothing to exclude
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
  return nlapiSubmitRecord(record);
}

function search(type, name, id) {
  var filters = new Array();
  filters[0] = new nlobjSearchFilter(name, null, 'contains', id, null);
  return nlapiSearchRecord(type, null, filters, null);
}

function get_item(item) {
  var itemRecord;
  var searchresults = search(inventoryitem, 'itemid', item.itemid);
  if (searchresults !== null && searchresults.length==1) {
    itemRecord = nlapiLoadRecord(inventoryitem, searchresults[0].getId());
  }
  else {
    itemRecord = nlapiCreateRecord(inventoryitem);
  }
  var recordId = updateFieldValues(itemRecord, item);
  return nlapiLoadRecord(inventoryitem, recordId);
}

function addItem(record, item) {
  var item = get_item(item);
  record.selectNewLineItem('item');
  record.setCurrentLineItemValue('item','item', item.getId());
  //record.setCurrentLineItemValue('item', 'location', 2);
  record.commitLineItem('item');
}

function removeLineItems(record) {
  for (var j=record.getLineItemCount('item'); j>=1; j--)
  {
    record.removeLineItem('item', j);
  }
}

function updatePO(record, datain) {
  var item;
  for (var index in datain.items) {
    item = datain.items[index];
    addItem(record, item);
  }
  delete(datain.items);
  var recordId = updateFieldValues(record, datain);
  return nlapiLoadRecord(purchaseorder, recordId);
}

function POST(datain) {
  var record = nlapiCreateRecord(purchaseorder);
  return updatePO(record, datain);
}

function PUT(datain) {
  var record = nlapiLoadRecord(purchaseorder, datain.id);
  removeLineItems(record);
  nlapiDeleteRecord(purchaseorder, datain.id);
  delete(datain.id);
  return updatePO(nlapiCreateRecord(purchaseorder), datain);
}

function DELETE(data) {
  return "No Dont Delete";
}