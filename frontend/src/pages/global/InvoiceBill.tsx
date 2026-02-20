import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBillById } from "../../api/billApi";
import html2pdf from "html2pdf.js";
import { URL_KEYS } from "../../constants/Url";

const InvoiceBill = () => {
  const { id } = useParams();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const {
    data: bill,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["singleBill", id],
    queryFn: () => getBillById(id as string),
    enabled: !!id,
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!invoiceRef.current) return;

    html2pdf()
      .from(invoiceRef.current)
      .set({
        margin: 10,
        filename: `Invoice-${bill.billNumber}.pdf`,
        html2canvas: { scale: 2 , useCORS:true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError || !bill) return <p>Bill Not Found</p>;

  const company = bill.items?.[0]?.company;
  const user = bill.user || {};
  const companyLocation = [company?.city, company?.state, company?.pincode]
    .filter(Boolean)
    .join(", ");
  const userLocation = [user?.city, user?.state, user?.pincode].filter(Boolean).join(", ");

  return (
    <>
      <div className="invoice-wrapper" ref={invoiceRef}>
        {/* Header */}
        <div className="invoice-header">
          <div className="company-info">
            <img
             crossOrigin="anonymous" 
              src={
                company?.logoImage
                  ? company?.logoImage.startsWith("http")
                    ? company?.logoImage
                    : `http://localhost:7000${URL_KEYS.UPLOAD.GET_IMAGE}/${company?.logoImage}`
                  : "https://via.placeholder.com/40"
              }
              alt={company?.companyName || "logo"}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <h2>{company?.companyName || "-"}</h2>
            <p>{[company?.address, companyLocation].filter(Boolean).join(", ") || "-"}</p>
            <p>GST: {company?.gstNumber?.toUpperCase?.() || "-"}</p>
          </div>

          <div className="user-info">
            <h1>INVOICE</h1>
            <p>Bill No: {bill.billNumber}</p>
            <p>
              Date:
              {new Date(bill.createdAt).toLocaleDateString()}
            </p>
            <h3>Customer Information</h3>
            <p>Name: {user?.name || "-"}</p>
            <p>Email: {user?.email || "-"}</p>
            <p>Phone: {user?.phone || "-"}</p>
            <p>Address: {user?.address || "-"}
            {", " + userLocation || "-"}</p>
          </div>
        </div>

        {/* Table */}
        <div>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>SR</th>
                <th>Product</th>
                <th>HSN</th>
                <th>Batch</th>
                <th>Exp</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>GST%</th>
                <th>GST Amt</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.productName}</td>
                  <td>{item.hsnCode}</td>
                  <td>{item.batch}</td>
                  <td>{item.expiry}</td>
                  <td>{item.qty}</td>
                  <td>₹{item.rate}</td>
                  <td>{item.gstPercent}%</td>
                  <td>₹{item.gstAmount}</td>
                  <td>{bill.paymentMethod}</td>
                  <td
                    style={{
                      color: `${bill.billStatus === "Paid" ? "green" : "red"}`,
                    }}
                  >
                    {bill.billStatus}
                  </td>
                  <td style={{ color: "blue" }}>₹{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="summary">
            <div className="summary-row">
              <span>Sub Total</span>
              <span>₹ {bill.subTotal}</span>
            </div>
            <div className="summary-row">
              <span>Total GST</span>
              <span>₹ {bill.totalGST}</span>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <span>₹ {bill.discount}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Grand Total</span>
              <span style={{ color: "blue" }}>₹ {bill.grandTotal}</span>
            </div>
          </div>
        </div>

        <div className="footer">Thank you for your business.</div>
      </div>

      {/* Buttons */}
      <div className="button-wrapper">
        <button className="btn btn-print" onClick={handlePrint}>
          Print PDF
        </button>
        <button className="btn btn-download" onClick={handleDownload}>
          Download PDF
        </button>
      </div>
    </>
  );
};

export default InvoiceBill;
