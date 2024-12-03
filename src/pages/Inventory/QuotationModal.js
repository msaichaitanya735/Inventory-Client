// src/components/QuotationModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Assuming you're using React Router


const QuotationModal = ({ product, onClose }) => {
  const [quotations, setQuotations] = useState([]);
  const [supplierNames, setSupplierNames] = useState({});

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const api = `https://main.dwoh96qwfxa1j.amplifyapp.com/inventory/viewquotations?purchaseId=${product[0].purchaseID}`;
        const response = await axios.get(api);
        setQuotations(response.data);



        // Fetch supplier names for each quotation
        const supplierIds = response.data.map(quotation => quotation.supplierID);
        const uniqueSupplierIds = [...new Set(supplierIds)]; // Remove duplicates

        // Fetch supplier names in parallel
        const promises = uniqueSupplierIds.map(supplierId =>
          axios.get(`https://main.dwoh96qwfxa1j.amplifyapp.com/inventory/getsupplier?supplierId=${supplierId}`)
        );

        const supplierResponses = await Promise.all(promises);
        const supplierNameMap = {};
        supplierResponses.forEach((response, index) => {
          supplierNameMap[uniqueSupplierIds[index]] = response.data.name;
        });

        setSupplierNames(supplierNameMap);
      } catch (error) {
        console.error('Error fetching quotations:', error);
      }
    };

    fetchQuotations();
  }, [product]);

  const handleAcceptQuotation = async (quotation) => {
    try {
      const api = `https://main.dwoh96qwfxa1j.amplifyapp.com/inventory/acceptquotaion?purchaseId=${quotation.purchaseID}&quotationId=${quotation.quotationID}`;
      const response = await axios.post(api);
      console.log(response.data);
    } catch (error) {
      console.error('Error accepting quotation:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Quotations</h2>
        <table>
          <thead>
            <tr>
              <th>Supplier Name</th><t/>
              <th>Offered Price</th><t/>
              <th>Date</th><t/>
              <th>Action</th>
              {/* Add more fields if needed */}
            </tr>
          </thead>
          <tbody>
            {quotations.map(quotation => {
              console.log(quotation)
              return(
              
              <tr key={quotation.quotationID}>
                <td>{supplierNames[quotation.supplierID]}</td><t/>
                <td>{quotation.price}</td><t/>
                <td>{quotation.localDate} {quotation.time} </td><t/>
                <td>
                <Link to="/supplierpayment"><button onClick={() => {

                  localStorage.setItem('quotation',JSON.stringify(quotation));
                  localStorage.setItem("Total",`${quotation.price}`);
                  // handleAcceptQuotation(quotation)
                  }}>Accept Quotation</button></Link>
                </td>
                {/* Add more fields if needed */}
              </tr>
            )})}
          </tbody>
        </table>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default QuotationModal;
