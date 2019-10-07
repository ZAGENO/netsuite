const inventoryitem = 'inventoryitem';
const purchaseorder = 'purchaseorder';

function GET(datain) {
    datain = JSON.parse(datain);
    return JSON.stringify(nlapiLoadRecord(datain.recordtype, datain.id));
}

function update_inventory_item(record, item) {
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
  var itemRecord;
  filters[0] = new nlobjSearchFilter('itemid', null, 'contains', item.itemid, null);
  var searchresults = nlapiSearchRecord(inventoryitem, null, filters, null);

  if (searchresults !== null && searchresults.length==1) {
    itemRecord = nlapiLoadRecord(inventoryitem, searchresults[0].getId());
  }
  else {
    itemRecord = nlapiCreateRecord(inventoryitem);
  }
  return update_inventory_item(itemRecord, item);
}

function addItem(record, item) {
  var lineItem = get_item(item);
  record.selectNewLineItem('item');
  record.setCurrentLineItemValue('item','item', lineItem.getId());
  //record.setCurrentLineItemValue('item', 'price', item.price);
  //record.setCurrentLineItemValue('item','isbillable','T');
  record.commitLineItem('item');
}


function POST(datain) {
  var record = nlapiCreateRecord(purchaseorder);
  var item;
  for (var index in datain.items) {
    item = datain.items[index];
    addItem(record, item);
  }

  for (var fieldname in datain)
  {
    if (datain.hasOwnProperty(fieldname))
      {
        if (fieldname != 'recordtype' && fieldname != 'id' && fieldname != 'items')
        {
          var value = datain[fieldname];
          if (value && typeof value != 'object')
            {
              record.setFieldValue(fieldname, value);
            }
         }
     }
  }
  var recordId = nlapiSubmitRecord(record);
  nlapiLogExecution('DEBUG','id='+recordId);

  return nlapiLoadRecord(purchaseorder,recordId);
}

function DELETE(data) {
  nlapiDeleteRecord(purchaseorder, data.id);
}