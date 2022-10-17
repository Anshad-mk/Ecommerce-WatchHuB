
function addToCart(ProID) {
  //  if ($("#userAvailable")) {
    $.ajax({
      url: "/users/addToCart/" + ProID,
      method: "get",
      success: (response) => {
        if (response.status === false) {
          location.href = "/users/login";
        } else if ($("#countid").html() != "") {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Item Added to Cart",
            showConfirmButton: false,
            timer: 1000,
          });
          let count = $("#countid").html();
          count = parseInt(count) + 1;
          $("#countid").html(count);
        }
      },
    });
  // } else {
  //   window.location.href = "/users/login";
  // }
}

function ChangeQuantity(cartID, ProID, count) {
  let ProQuantity = parseInt(document.getElementById(ProID).value);
  let ProPrice=parseInt(document.getElementById('price'+ProID).innerHTML)
  count = parseInt(count);
  console.log(ProQuantity);

  

  $.ajax({
    url: "/users/changeProQuantity",
    data: {
      cartID: cartID,
      ProID: ProID,
      count: count,
      ProQuantity: ProQuantity,
    },
    method: "post",
    success:(response) => {
      if (response.removeProduct) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Item Removed from Cart",
          showConfirmButton: false,
          timer: 1000,
        });
        location.reload();
      } else {
        let no=ProQuantity + count;
        document.getElementById(ProID).value = no
        document.getElementById('sum'+ProID).innerHTML = ProPrice* parseInt(document.getElementById(ProID).value)
        document.getElementById('total').innerHTML=response.tottleCost
        document.getElementById('subtotal').innerHTML=response.tottleCost
        console.log(response.tottleCost);
        
      }
    },
  });
}



function removeProducts(cartID, ProID){
$.ajax({
    url:'/users/removeCartProduct',
    method:'post',
    data:{
        cartID:cartID,
        ProID:ProID
    },
    success:(response)=>{
      if(response.ProRemove){
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Item Removed from Cart",
            showConfirmButton: false,
            timer: 1000,
          });
          location.reload(); 
      }
        
    }
})


}

// orders  

function confirmDelete(OrdeID) {
  const btn= document.getElementById(OrdeID+'buttoncancel')
  const statustd=document.getElementById('td'+OrdeID)
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, cancel it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url:`/users/cancel_Order/${OrdeID}`,
        method:'get',
        success:(response)=>{
          if(response){
      btn.className='btn btn-dark shadow-lg '
      btn.disabled=true
      btn.innerHTML="Order Canceled"
      statustd.className='shadow-lg  bg-secondary rounded text-center'
      statustd.innerHTML=`<strong>Order Canceld</strong>`

          }
          
          
        }
      })
      
    }
  })



}




