function addToWishList(id, user) {
    // console.log('hiii');
    $.ajax({
        url: `/users/addTowish/${id}`,
        method: 'get',
        success: (response) => {
            if (response.status == true) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Item Added to wishlist",
                    showConfirmButton: false,
                    timer: 500,
                });
            } else {
                location.href = "/users/login";
            }
        }
    })
}
function removewishlistitem(ProID, name) {
    $.ajax({
        url: `/users/removewish/${ProID}`,
        method: 'get',
        success: (response) => {
            if (response.status == true) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Item Removed from wishlist",
                    showConfirmButton: false,
                    timer: 500,
                });
                location.reload()
            } else {
                location.href = "/users/login";
            }
        }
    })
}

function wishToCart(ProID, user) {
    $.ajax({
        url: "/users/addToCart/" + ProID,
        method: "get",
        success: (response) => {
            if (response.status === true) {
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
                $.ajax({
                    url: `/users/removewish/${ProID}`,
                    method: 'get',
                    success: (response) => {
                        if (response.status == true) {
                            location.reload()
                        }
                    }
                })
            } else if (response.status === false || !user) {
                location.href = "/users/login";
            }
        },
    });

}
