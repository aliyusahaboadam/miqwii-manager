// import { Document,
//    Page,
//    Text,
//    View,
//    StyleSheet,
//    Image,
//    Font, } from '@react-pdf/renderer';
// const StudentResult = () => {
   
//    const totalAmount = invoiceData.items.reduce(
//       (total, item) => total + item.quantity * item.unitPrice,
//       0
//     );

//    return(
//       <Document>
    
// {invoiceData.sender.name}
//       {invoiceData.sender.address}
//         {invoiceData.sender.city}, {invoiceData.sender.state}{" "}
//         {invoiceData.sender.zip}
//       {invoiceData.recipient.name}
//         {invoiceData.recipient.address}
//         {invoiceData.recipient.city}, {invoiceData.recipient.state}{" "}
//         {invoiceData.recipient.zip}
//           Description
//           Quantity
//           Unit Price
//           Amount
//       {invoiceData.items.map((item, index) => (
//             {item.description}
//             {item.quantity}
//               {item.unitPrice.toFixed(2)}
//               {(item.quantity * item.unitPrice).toFixed(2)}
//       ))}
//       Total:
//       ${totalAmount.toFixed(2)}

//       </Document>
    

//    );
// }


// const invoiceData = {
//    sender: {
//      name: "John Doe",
//      address: "123 Main Street",
//      city: "New York",
//      state: "NY",
//      zip: "10001",
//    },
//    recipient: {
//      name: "Jane Smith",
//      address: "456 Elm Street",
//      city: "San Francisco",
//      state: "CA",
//      zip: "94107",
//    },
//    items: [
//      { description: "Item 1", quantity: 2, unitPrice: 10 },
//      { description: "Item 2", quantity: 3, unitPrice: 15 },
//      { description: "Item 3", quantity: 1, unitPrice: 20 },
//    ],
//    invoiceNumber: "INV-123456",
//    date: "April 26, 2023",
//  };

//  const styles = StyleSheet.create({
//    page: {
//      backgroundColor: "#FFF",
//      padding: 30,
//    },
//    header: {
//      fontSize: 24,
//      textAlign: "center",
//      marginBottom: 30,
//    },
//    sender: {
//      marginBottom: 20,
//    },
//    recipient: {
//      marginBottom: 30,
//    },
//    addressLine: {
//      fontSize: 12,
//      marginBottom: 2,
//    },
//    itemsTable: {
//      display: "table",
//      width: "100%",
//      borderStyle: "solid",
//      borderWidth: 1,
//      borderRightWidth: 0,
//      borderBottomWidth: 0,
//    },
//    tableRow: {
//      margin: "auto",
//      flexDirection: "row",
//    },
//    tableColHeader: {
//      width: "25%",
//      borderStyle: "solid",
//      borderWidth: 1,
//      borderLeftWidth: 0,
//      borderTopWidth: 0,
//      backgroundColor: "#F0F0F0",
//    },
//    tableCol: {
//      width: "25%",
//      borderStyle: "solid",
//      borderWidth: 1,
//      borderLeftWidth: 0,
//      borderTopWidth: 0,
//    },
//    tableCell: {
//      fontSize: 12,
//      textAlign: "center",
//      padding: 5,
//    },
//    total: {
//      marginTop: 20,
//      textAlign: "right",
//    },
//    totalLabel: {
//      fontSize: 14,
//      fontWeight: "bold",
//    },
//    totalValue: {
//      fontSize: 14,
//    },
//  });


// export default StudentResult;