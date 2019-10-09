const dataType = "purchaseorder";
const targetDataType = "vendorbill";

function GET(data) {
   return nlapiLoadRecord(dataType, data.id);
}

function update_all(count, record, data) {
  for (var fieldname in data)
  {
    if (data.hasOwnProperty(fieldname))
    {
      if (fieldname != 'itemid')
      {
        var value = data[fieldname];
        if (value && typeof value != 'object') // ignore other type of parameters
        {
          record.setLineItemValue('item',fieldname, count, value);
        }
      }
    }
  }
}

function get_itemid(vendor_bill, line_number) {
  var _itemid = vendor_bill.getLineItemValue('item', 'item', line_number);
  var item = nlapiLoadRecord('inventoryitem', _itemid);
  return item.getFieldValue('itemid');
}

function create_vb(data) {
  var vb_record = nlapiTransformRecord(dataType, data.po_id, targetDataType);
  for (var j = vb_record.getLineItemCount('item'); j>=1; j--)
  {
    var remove=true;
    for(var i=0; i<data.items.length; i++) {
      if(get_itemid(vb_record, j)==data.items[i].itemid) {
        remove=false;
        update_all(j, vb_record, data.items[i]);
      }
    }
    if (remove) {
      vb_record.removeLineItem('item', j);
    }
  }
  var vb = nlapiSubmitRecord(vb_record);
  return nlapiLoadRecord(targetDataType, vb);
}

function POST(data) {
  return create_vb(data);
}

function PUT(data) {
  nlapiDeleteRecord(targetDataType, data.vb_id);
  return create_vb(data);
}