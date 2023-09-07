exports.buildInvoice = (doc, order) => {
  doc.fontSize(20).text('Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Order ID: ${order._id}`);
  doc.moveDown();
  doc.fontSize(12).text(`User Email: ${order.user.email}`);
  doc.moveDown();
  const table = {
    headers: ['Product', 'Description', 'Price', 'Quantity'],
    rows: [],
  };
  let totalPrice = 0;
  order.items.forEach((item) => {
    const product = item.product;
    table.rows.push([
      product.title,
      product.description,
      `$${product.price}`,
      `x${item.quantity}`,
    ]);
    totalPrice += product.price * item.quantity;
  });
  const rowColors = ['#DDDDDD', '#FFFFFF'];
  let currentRowColorIndex = 0;
  const tableTop = doc.y;
  table.rows.forEach((row, i) => {
    const y = tableTop + i * 30;
    doc
      .rect(50, y, 500, 30)
      .fillColor(rowColors[currentRowColorIndex])
      .fillAndStroke();
    doc
      .fillColor('black')
      .text(row[0], 60, y + 10, { width: 375, align: 'left' });
    doc
      .text(row[1], 160, y + 10, { width: 50, align: 'right' })
      .fillColor('black');
    doc
      .text(row[2], 360, y + 10, { width: 50, align: 'right' })
      .fillColor('black');
    doc
      .text(row[3], 460, y + 10, { width: 25, align: 'right' })
      .fillColor('black');
    currentRowColorIndex = 1 - currentRowColorIndex;
  });
  doc.moveDown();
  doc.fontSize(12).text(`Total Price: $${totalPrice}`, { align: 'left' });
  doc.moveDown();
};
