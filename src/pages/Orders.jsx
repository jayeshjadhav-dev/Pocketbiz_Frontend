import React, { useState, useRef } from 'react';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('customer');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // Modal states for creating a manual order
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrderName, setNewOrderName] = useState('');
  const [newOrderDate, setNewOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [newOrderItems, setNewOrderItems] = useState([{ itemName: '', qty: 1, unitPrice: 0 }]);

  // Orders State Architecture
  const [customerOrders, setCustomerOrders] = useState([
    {
      id: "CUST-9081",
      name: "Raj Supermarket",
      date: "2026-06-20",
      total: "$240.00",
      status: "Delivered",
      items: [
        { itemName: "Custom Printed Business Cards", qty: 2, unitPrice: 30.00 },
        { itemName: "Premium POS Thermal Rolls", qty: 12, unitPrice: 10.00 },
        { itemName: "Barcode Scanner Stand", qty: 2, unitPrice: 30.00 }
      ]
    },
    {
      id: "CUST-9082",
      name: "Kiran Hardware Store",
      date: "2026-06-21",
      total: "$1,200.00",
      status: "Processing",
      items: [
        { itemName: "CCTV Camera Node Mounts", qty: 15, unitPrice: 40.00 },
        { itemName: "Cat6 Ethernet Cable Spool (100m)", qty: 4, unitPrice: 150.00 }
      ]
    }
  ]);

  const [supplierOrders, setSupplierOrders] = useState([
    {
      id: "SUPP-4401",
      supplierName: "Zenith Tech Wholesale",
      date: "2026-06-18",
      total: "$3,450.00",
      status: "Shipped",
      items: [
        { itemName: "4K Dome CCTV Cameras", qty: 10, unitPrice: 250.00 },
        { itemName: "8-Channel NVR Storage Box", qty: 3, unitPrice: 316.66 }
      ]
    }
  ]);

  const activeOrders = activeTab === 'customer' ? customerOrders : supplierOrders;

  // --- MANUAL ORDER HANDLERS ---
  const handleAddItemRow = () => {
    setNewOrderItems([...newOrderItems, { itemName: '', qty: 1, unitPrice: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...newOrderItems];
    updated[index][field] = value;
    setNewOrderItems(updated);
  };

  const handleSaveOrder = (e) => {
    e.preventDefault();
    
    // Calculate gross total
    const grandTotalNum = newOrderItems.reduce((acc, curr) => acc + (curr.qty * curr.unitPrice), 0);
    const formattedTotal = `$${grandTotalNum.toFixed(2)}`;
    const generatedId = `${activeTab === 'customer' ? 'CUST' : 'SUPP'}-${Math.floor(1000 + Math.random() * 9000)}`;

    const freshOrder = {
      id: generatedId,
      name: activeTab === 'customer' ? newOrderName : undefined,
      supplierName: activeTab === 'supplier' ? newOrderName : undefined,
      date: newOrderDate,
      total: formattedTotal,
      status: "Pending",
      items: newOrderItems
    };

    if (activeTab === 'customer') {
      setCustomerOrders([freshOrder, ...customerOrders]);
    } else {
      setSupplierOrders([freshOrder, ...supplierOrders]);
    }

    // Reset Form Fields
    setIsModalOpen(false);
    setNewOrderName('');
    setNewOrderItems([{ itemName: '', qty: 1, unitPrice: 0 }]);
  };

  // --- EXPORT & SHARE FUNCTIONS ---
  const printInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    const orderTitle = order.name || order.supplierName;
    
    const itemsHtml = order.items.map(item => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px; font-size: 14px; color: #334155;">${item.itemName}</td>
        <td style="padding: 12px; font-size: 14px; color: #334155; text-align: center;">${item.qty}</td>
        <td style="padding: 12px; font-size: 14px; color: #334155; text-align: right;">$${Number(item.unitPrice).toFixed(2)}</td>
        <td style="padding: 12px; font-size: 14px; color: #1e293b; text-align: right; font-weight: 600;">$${(item.qty * item.unitPrice).toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice_${order.id}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
            .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 9999px; font-weight: bold; font-size: 12px; border: 1px solid #10b981; color: #065f46; background: #ecfdf5; }
            .checkmark { color: #10b981; font-weight: bold; }
          </style>
        </head>
        <body>
          <div style="max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 30px;">
              <div>
                <h1 style="margin: 0; font-size: 28px; color: #4f46e5; letter-spacing: -0.5px;">PocketBiz</h1>
                <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">Small Business Ledger & Operations Ecosystem</p>
              </div>
              <div style="text-align: right;">
                <div class="badge">
                  <span class="checkmark">✓</span> POCKETBIZ VERIFIED SYSTEM INVOICE
                </div>
                <p style="margin: 10px 0 0 0; font-family: monospace; font-size: 14px; color: #64748b;">ID: <b>${order.id}</b></p>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 40px; font-size: 14px;">
              <div>
                <h3 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #94a3b8; tracking: 0.5px;">Target Entity</h3>
                <p style="margin: 0; font-size: 16px; font-weight: bold; color: #0f172a;">${orderTitle}</p>
              </div>
              <div style="text-align: right;">
                <h3 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #94a3b8; tracking: 0.5px;">Issue Date</h3>
                <p style="margin: 0; font-size: 16px; font-weight: bold; color: #0f172a;">${order.date}</p>
              </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 30px;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 12px; font-size: 12px; text-transform: uppercase; color: #64748b;">Requirement Details</th>
                  <th style="padding: 12px; font-size: 12px; text-transform: uppercase; color: #64748b; text-align: center;">Qty</th>
                  <th style="padding: 12px; font-size: 12px; text-transform: uppercase; color: #64748b; text-align: right;">Rate</th>
                  <th style="padding: 12px; font-size: 12px; text-transform: uppercase; color: #64748b; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>

            <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <span style="font-size: 13px; color: #64748b; max-width: 400px;">This file serves as an authenticated system transaction log processed safely inside the PocketBiz Business Environment.</span>
              <div style="text-align: right;">
                <span style="font-size: 12px; text-transform: uppercase; color: #94a3b8; display: block; margin-bottom: 4px;">Grand Total</span>
                <span style="font-size: 24px; font-weight: 800; color: #0f172a;">${order.total}</span>
              </div>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getShareText = (order) => {
    const title = order.name || order.supplierName;
    return encodeURIComponent(`PocketBiz Verified Invoice\nOrder ID: ${order.id}\nEntity: ${title}\nDate: ${order.date}\nTotal Amount: ${order.total}\n\nGenerated securely via PocketBiz.`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER SEGMENT */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders Management</h1>
          <p className="text-slate-500 text-sm">Track procurement pipelines and downstream customer fulfillment lists.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* TAB SELECTOR */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => { setActiveTab('customer'); setExpandedOrderId(null); }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${activeTab === 'customer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Customer Orders
            </button>
            <button
              onClick={() => { setActiveTab('supplier'); setExpandedOrderId(null); }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${activeTab === 'supplier' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Supplier Orders
            </button>
          </div>

          {/* ADD ORDER TRIGGER */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm shadow-indigo-600/10 ml-auto sm:ml-0"
          >
            <span>+</span> Add Manual Order
          </button>
        </div>
      </div>

      {/* TABLE WORKFLOW GRID */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 text-slate-400 uppercase text-xs font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">{activeTab === 'customer' ? 'Customer Name' : 'Supplier Target'}</th>
                <th className="p-4">Date</th>
                <th className="p-4">Financial Value</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {activeOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className={`hover:bg-slate-50/60 transition ${expandedOrderId === order.id ? 'bg-indigo-50/20' : ''}`}>
                    <td className="p-4 font-mono font-bold text-slate-900">{order.id}</td>
                    <td className="p-4 font-medium text-slate-900">{order.name || order.supplierName}</td>
                    <td className="p-4 text-slate-500">{order.date}</td>
                    <td className="p-4 font-semibold text-slate-900">{order.total}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${order.status === 'Delivered' || order.status === 'Shipped' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-3">
                      <button 
                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                        className="text-slate-500 hover:text-slate-800 text-xs font-semibold"
                      >
                        {expandedOrderId === order.id ? 'Hide Details ▲' : 'View Requirements ▼'}
                      </button>
                      
                      {/* PRINT / EXPORT DOWNLOADABLE PDF */}
                      <button 
                        onClick={() => printInvoice(order)}
                        title="Download / Print PDF Invoice"
                        className="text-indigo-600 hover:text-indigo-800 p-1 bg-indigo-50 hover:bg-indigo-100 rounded transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      </button>

                      {/* SHARE VIA WHATSAPP */}
                      <a 
                        href={`https://api.whatsapp.com/send?text=${getShareText(order)}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Share Invoice details on WhatsApp"
                        className="text-emerald-600 hover:text-emerald-800 p-1 bg-emerald-50 hover:bg-emerald-100 rounded transition"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-3.56c1.655.982 3.511 1.5 5.409 1.512 5.517 0 10.014-4.493 10.017-10.01.002-2.673-1.037-5.186-2.928-7.078-1.892-1.891-4.407-2.932-7.08-2.932-5.524 0-10.02 4.493-10.023 10.01-.001 1.916.498 3.79 1.446 5.461l-.993 3.626 3.712-.973zm13.174-6.852c-.304-.154-1.803-.888-2.083-.989-.279-.101-.483-.153-.688.154-.204.308-.792.99-.972 1.193-.18.203-.362.228-.666.074-.304-.153-1.285-.473-2.448-1.51-1.002-.893-1.502-1.637-1.682-1.945-.18-.308-.02-.475.134-.627.14-.136.304-.356.457-.534.151-.177.202-.304.304-.508.102-.202.051-.38-.025-.533-.077-.152-.688-1.658-.942-2.27-.247-.6-.5-.519-.688-.528-.178-.008-.382-.01-.587-.01-.205 0-.537.076-.817.382-.28.308-1.07 1.046-1.07 2.553 0 1.507 1.097 2.965 1.25 3.169.153.202 2.158 3.297 5.228 4.625.73.315 1.298.504 1.743.645.734.234 1.401.2 1.928.121.588-.088 1.804-.737 2.058-1.45.255-.713.255-1.322.179-1.45-.076-.127-.279-.203-.583-.356z"/></svg>
                      </a>

                      {/* SHARE VIA EMAIL */}
                      <a 
                        href={`mailto:?subject=PocketBiz%20System%20Invoice%20${order.id}&body=${getShareText(order)}`}
                        title="Email Invoice Log"
                        className="text-slate-600 hover:text-slate-800 p-1 bg-slate-100 hover:bg-slate-200 rounded transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </a>
                    </td>
                  </tr>

                  {/* DROP DOWN REQUIREMENT SUB-TABLE */}
                  {expandedOrderId === order.id && (
                    <tr>
                      <td colSpan="6" className="bg-slate-50/80 p-5 border-t border-b border-slate-200">
                        <div className="bg-white rounded-xl border border-slate-200 p-4 max-w-3xl shadow-inner">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Itemized Requirement List</h4>
                          <div className="space-y-2">
                            <div className="grid grid-cols-12 text-xs font-bold text-slate-400 uppercase pb-1 border-b border-slate-100">
                              <div className="col-span-7">Item Description</div>
                              <div className="col-span-2 text-center">Quantity</div>
                              <div className="col-span-3 text-right">Unit Pricing</div>
                            </div>
                            {order.items.map((item, index) => (
                              <div key={index} className="grid grid-cols-12 text-sm text-slate-700 py-1 border-b border-slate-50 last:border-0 items-center">
                                <div className="col-span-7 font-medium text-slate-900">{item.itemName}</div>
                                <div className="col-span-2 text-center font-mono text-slate-600 bg-slate-100 rounded py-0.5 mx-auto px-2 max-w-fit">{item.qty}</div>
                                <div className="col-span-3 text-right font-mono text-slate-600">${Number(item.unitPrice).toFixed(2)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL FORM DIALOG: ADD MANUAL ORDER --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-lg">Add Manual {activeTab === 'customer' ? 'Customer Order' : 'Supplier Request'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleSaveOrder} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{activeTab === 'customer' ? 'Customer / Merchant Name' : 'Supplier Target Entity'}</label>
                <input required type="text" value={newOrderName} onChange={(e) => setNewOrderName(e.target.value)} placeholder="e.g. Apex Trading Corp" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Transaction Date</label>
                <input required type="date" value={newOrderDate} onChange={(e) => setNewOrderDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Requirement Grid Items</label>
                  <button type="button" onClick={handleAddItemRow} className="text-xs text-indigo-600 font-bold hover:text-indigo-800">+ Add Row</button>
                </div>
                
                {newOrderItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input required type="text" placeholder="Item Name" value={item.itemName} onChange={(e) => handleItemChange(idx, 'itemName', e.target.value)} className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none" />
                    <input required type="number" min="1" placeholder="Qty" value={item.qty} onChange={(e) => handleItemChange(idx, 'qty', parseInt(e.target.value) || 1)} className="w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-sm text-center focus:outline-none" />
                    <input required type="number" step="0.01" min="0" placeholder="Price" value={item.unitPrice} onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-24 px-2 py-1.5 border border-slate-200 rounded-lg text-sm text-right focus:outline-none" />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-sm">Save Order Logs</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}