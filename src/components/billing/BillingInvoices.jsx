import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  FileText, 
  CreditCard, 
  Percent, 
  X,
  Building,
  User,
  Shield,
  IndianRupee
} from 'lucide-react';
import { CLINIC_INFO } from '../../data/mockDentalData';

export default function BillingInvoices({
  invoices,
  patients,
  procedures,
  onSaveInvoice
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'paid' | 'partial' | 'pending'
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [activePrintInvoice, setActivePrintInvoice] = useState(null);

  // New Invoice Form State
  const [newInvoicePatientId, setNewInvoicePatientId] = useState(patients[0]?.id || '');
  const [invoiceItems, setInvoiceItems] = useState([
    { code: 'D0150', description: 'Comprehensive Oral Exam & 3D Scan', quantity: 1, unitPrice: 800, amount: 800 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [insuranceCovered, setInsuranceCovered] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('UPI (GPay / PhonePe)');
  const [amountPaid, setAmountPaid] = useState(0);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = inv.invoiceNumber?.toLowerCase().includes(q);
        const matchName = inv.patientName?.toLowerCase().includes(q);
        if (!matchNum && !matchName) return false;
      }
      return true;
    });
  }, [invoices, statusFilter, searchQuery]);

  // Totals calculations for new invoice
  const subtotal = useMemo(() => {
    return invoiceItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [invoiceItems]);

  const total = Math.max(0, subtotal - Number(discount));
  const patientPortion = Math.max(0, total - Number(insuranceCovered));

  // Handle Add Item to New Invoice
  const handleAddLineItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { code: 'D1110', description: 'Full Mouth Ultrasonic Scaling & Polish', quantity: 1, unitPrice: 1500, amount: 1500 }
    ]);
  };

  const handleRemoveItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...invoiceItems];
    updated[index][field] = value;
    if (field === 'quantity' || field === 'unitPrice') {
      const qty = field === 'quantity' ? Number(value) : Number(updated[index].quantity);
      const price = field === 'unitPrice' ? Number(value) : Number(updated[index].unitPrice);
      updated[index].amount = qty * price;
    }
    setInvoiceItems(updated);
  };

  const handleSelectProcedureForLine = (index, procId) => {
    const proc = procedures.find(p => p.id === procId);
    if (proc) {
      const updated = [...invoiceItems];
      updated[index].code = proc.code;
      updated[index].description = proc.name;
      updated[index].unitPrice = proc.price;
      updated[index].amount = updated[index].quantity * proc.price;
      setInvoiceItems(updated);
    }
  };

  // Submit New Invoice
  const handleCreateInvoiceSubmit = (e) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === newInvoicePatientId);
    const invNum = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

    const paidNum = Number(amountPaid);
    let invoiceStatus = 'pending';
    if (paidNum >= total) invoiceStatus = 'paid';
    else if (paidNum > 0) invoiceStatus = 'partial';

    const newInv = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNum,
      patientId: newInvoicePatientId,
      patientName: patient?.name || 'Patient',
      patientPhone: patient?.phone || '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items: invoiceItems,
      subtotal,
      discount: Number(discount),
      tax: 0,
      total,
      insuranceCovered: Number(insuranceCovered),
      patientPortion,
      amountPaid: paidNum,
      status: invoiceStatus,
      paymentMethod
    };

    onSaveInvoice(newInv);
    setIsNewInvoiceModalOpen(false);
  };

  // Aggregate Stats
  const stats = useMemo(() => {
    const totalBilled = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const totalCollected = invoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
    const totalPending = totalBilled - totalCollected;
    return { totalBilled, totalCollected, totalPending };
  }, [invoices]);

  return (
    <div className="billing-container">
      {/* Top Banner */}
      <div className="billing-header-row">
        <div>
          <h2>Billing & Invoices</h2>
          <p className="subtitle">
            Invoices, receipts, and insurance claims.
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-primary glow-cyan"
          onClick={() => setIsNewInvoiceModalOpen(true)}
        >
          <Plus size={18} />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Financial Overview Metrics */}
      <div className="billing-metrics-grid">
        <div className="billing-stat-card glass-card">
          <div className="stat-icon-wrap cyan">
            <span style={{ fontSize: '20px', fontWeight: '800' }}>₹</span>
          </div>
          <div>
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">₹{stats.totalBilled.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="billing-stat-card glass-card">
          <div className="stat-icon-wrap green">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="stat-label">Payments Received</span>
            <span className="stat-value text-green">₹{stats.totalCollected.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="billing-stat-card glass-card">
          <div className="stat-icon-wrap amber">
            <Clock size={20} />
          </div>
          <div>
            <span className="stat-label">Outstanding Balance</span>
            <span className="stat-value text-amber">₹{stats.totalPending.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="invoices-table-card glass-card">
        <div className="table-filter-bar">
          <div className="search-box">
            <Search size={16} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search invoice number or patient..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-item">
            <label>Payment Status:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Invoices</option>
              <option value="paid">Fully Paid</option>
              <option value="partial">Partial Payment</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Patient</th>
                <th>Issue Date</th>
                <th>Procedures / Line Items</th>
                <th>Total (₹)</th>
                <th>Insurance (₹)</th>
                <th>Paid (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(inv => (
                <tr key={inv.id}>
                  <td>
                    <span className="invoice-badge">{inv.invoiceNumber}</span>
                  </td>
                  <td>
                    <strong>{inv.patientName}</strong>
                  </td>
                  <td>{inv.date}</td>
                  <td>
                    <span className="items-summary-tag">
                      {inv.items?.length || 1} procedure(s) ({inv.items?.[0]?.description?.slice(0, 24)}...)
                    </span>
                  </td>
                  <td><strong>₹{Number(inv.total || 0).toLocaleString('en-IN')}</strong></td>
                  <td className="text-cyan">₹{Number(inv.insuranceCovered || 0).toLocaleString('en-IN')}</td>
                  <td className="text-green">₹{Number(inv.amountPaid || 0).toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`status-badge ${inv.status}`}>
                      {inv.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-outline-cyan"
                      onClick={() => setActivePrintInvoice(inv)}
                      title="View Printable Receipt / Estimate"
                    >
                      <Printer size={14} /> Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create New Invoice Modal */}
      {isNewInvoiceModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card glass-card invoice-modal-wide">
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <FileText size={20} className="text-cyan" />
                </div>
                <div>
                  <h3>Generate Dental Invoice (₹ INR)</h3>
                  <p className="text-muted text-sm">Add dental treatments, discounts, and UPI / insurance coverage</p>
                </div>
              </div>
              <button type="button" className="icon-close-btn" onClick={() => setIsNewInvoiceModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="modal-form">
              <div className="form-group">
                <label>Select Patient Record *</label>
                <select 
                  value={newInvoicePatientId} 
                  onChange={(e) => setNewInvoicePatientId(e.target.value)}
                  className="select-input"
                  required
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.insuranceProvider} ({p.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Items Builder */}
              <div className="line-items-section">
                <div className="section-title-row">
                  <span className="section-heading">Procedure Line Items</span>
                  <button type="button" className="btn btn-sm btn-secondary" onClick={handleAddLineItem}>
                    <Plus size={14} /> Add Line Item
                  </button>
                </div>

                <div className="line-items-list">
                  {invoiceItems.map((item, index) => (
                    <div key={index} className="line-item-row">
                      <div className="proc-picker-col">
                        <label className="text-xs text-muted">Dental Procedure Template</label>
                        <select 
                          onChange={(e) => handleSelectProcedureForLine(index, e.target.value)}
                          className="select-input"
                        >
                          <option value="">-- Choose Dental Service --</option>
                          {procedures.map(p => (
                            <option key={p.id} value={p.id}>
                              [{p.code}] {p.name} (₹{p.price.toLocaleString('en-IN')})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="desc-col">
                        <label className="text-xs text-muted">Item Description</label>
                        <input 
                          type="text" 
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="text-input"
                          required
                        />
                      </div>

                      <div className="qty-col">
                        <label className="text-xs text-muted">Qty</label>
                        <input 
                          type="number" 
                          min="1" 
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="text-input"
                        />
                      </div>

                      <div className="price-col">
                        <label className="text-xs text-muted">Unit (₹)</label>
                        <input 
                          type="number" 
                          min="0" 
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          className="text-input"
                        />
                      </div>

                      <div className="amount-col">
                        <label className="text-xs text-muted">Total</label>
                        <span className="line-item-amount">₹{Number(item.amount || 0).toLocaleString('en-IN')}</span>
                      </div>

                      {invoiceItems.length > 1 && (
                        <button 
                          type="button" 
                          className="remove-line-btn" 
                          onClick={() => handleRemoveItem(index)}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Adjustments Grid */}
              <div className="form-grid-3 py-3">
                <div className="form-group">
                  <label>Discounts / Courtesies (₹)</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="text-input"
                  />
                </div>

                <div className="form-group">
                  <label>Insurance / TPA Coverage (₹)</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={insuranceCovered}
                    onChange={(e) => setInsuranceCovered(e.target.value)}
                    className="text-input"
                  />
                </div>

                <div className="form-group">
                  <label>Payment Received Today (₹)</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="text-input"
                  />
                </div>
              </div>

              {/* Summary Calculations Callout */}
              <div className="invoice-summary-box">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row">
                  <span>Discount:</span>
                  <span>-₹{Number(discount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row font-bold">
                  <span>Total Due:</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row text-cyan">
                  <span>Insurance / TPA Responsibility:</span>
                  <span>₹{Number(insuranceCovered || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row text-amber font-bold">
                  <span>Patient Out-of-Pocket Balance:</span>
                  <span>₹{patientPortion.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewInvoiceModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary glow-cyan">
                  <CheckCircle2 size={16} /> Save & Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {activePrintInvoice && (
        <div className="modal-backdrop">
          <div className="modal-card glass-card printable-receipt-card">
            <div className="receipt-header-actions">
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => window.print()}
              >
                <Printer size={14} /> Print / Save PDF
              </button>
              <button 
                type="button" 
                className="icon-close-btn" 
                onClick={() => setActivePrintInvoice(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Printable Document Body */}
            <div className="receipt-sheet" id="printable-receipt">
              <div className="receipt-clinic-head">
                <div>
                  <h2>{CLINIC_INFO.name}</h2>
                  <p className="text-muted text-xs">{CLINIC_INFO.address}</p>
                  <p className="text-muted text-xs">Tel: {CLINIC_INFO.phone} | Email: {CLINIC_INFO.email}</p>
                </div>
                <div className="receipt-meta-right">
                  <span className="receipt-type-title">DENTAL INVOICE / RECEIPT</span>
                  <span className="receipt-code">#{activePrintInvoice.invoiceNumber}</span>
                  <span className="text-xs">Date: {activePrintInvoice.date}</span>
                </div>
              </div>

              <div className="receipt-patient-block">
                <div>
                  <strong>Billed To:</strong>
                  <p>{activePrintInvoice.patientName}</p>
                  <p className="text-xs text-muted">Phone: {activePrintInvoice.patientPhone}</p>
                </div>
                <div>
                  <strong>Payment Status:</strong>
                  <span className={`status-badge ${activePrintInvoice.status}`}>
                    {activePrintInvoice.status?.toUpperCase()}
                  </span>
                  <p className="text-xs text-muted">Method: {activePrintInvoice.paymentMethod}</p>
                </div>
              </div>

              <table className="receipt-items-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Clinical Procedure Description</th>
                    <th>Qty</th>
                    <th>Unit Fee (₹)</th>
                    <th>Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {activePrintInvoice.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.code || 'CDT'}</td>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>₹{Number(item.unitPrice || 0).toLocaleString('en-IN')}</td>
                      <td>₹{Number(item.amount || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="receipt-totals-grid">
                <div className="receipt-notes-col">
                  <strong>Clinical Notice:</strong>
                  <p className="text-xs text-muted">
                    This document serves as an official clinical billing statement. Dental insurance/TPA estimations are subject to policy terms and approvals. UPI payments can be made directly to clinic VPA.
                  </p>
                </div>
                <div className="receipt-math-col">
                  <div className="math-line"><span>Subtotal:</span> <span>₹{Number(activePrintInvoice.subtotal || 0).toLocaleString('en-IN')}</span></div>
                  {activePrintInvoice.discount > 0 && (
                    <div className="math-line"><span>Discount:</span> <span>-₹{Number(activePrintInvoice.discount || 0).toLocaleString('en-IN')}</span></div>
                  )}
                  <div className="math-line total"><span>Total Billed:</span> <span>₹{Number(activePrintInvoice.total || 0).toLocaleString('en-IN')}</span></div>
                  <div className="math-line"><span>Insurance/TPA Covered:</span> <span>₹{Number(activePrintInvoice.insuranceCovered || 0).toLocaleString('en-IN')}</span></div>
                  <div className="math-line paid"><span>Amount Paid:</span> <span>₹{Number(activePrintInvoice.amountPaid || 0).toLocaleString('en-IN')}</span></div>
                  <div className="math-line balance">
                    <span>Balance Due:</span> 
                    <span>₹{Math.max(0, (activePrintInvoice.total || 0) - (activePrintInvoice.amountPaid || 0)).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="receipt-footer">
                <p>Thank you for choosing {CLINIC_INFO.name}. For billing or UPI inquiries, call {CLINIC_INFO.phone}.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
