const deleteProduct = async (btn) => {
  try {
    const productId = btn.parentNode.querySelector('[name=id]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const productElement = btn.closest('article');

    const result = await fetch(`/admin/product/${productId}`, {
      method: 'DELETE',
      headers: {
        'csrf-token': csrf,
      },
    });
    const data = await result.json();
    console.log(data);
    productElement.parentNode.removeChild(productElement);
  } catch (error) {
    console.log(error);
  }
};
