import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
    getFirestore, collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCn3ogWlNH1TkxuJJae8irIGp9Fon-IoU4",
    authDomain: "shopping-c8327.firebaseapp.com",
    projectId: "shopping-c8327",
    storageBucket: "shopping-c8327.firebasestorage.app",
    messagingSenderId: "402376993306",
    appId: "1:402376993306:web:0768b1b73e94c828f73fa3",
    measurementId: "G-SW78KSGN7T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let UserId = null;

// ========================== SIGN UP ==========================
let getsbtn = document.getElementById('sbtn');
if (getsbtn) {
    getsbtn.addEventListener('click', () => {
        let email = document.getElementById('semail').value.trim();
        let password = document.getElementById('spassword').value.trim();

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                Swal.fire({ icon: 'success', title: 'Signup Successful', timer: 2000, showConfirmButton: false });
                setTimeout(() => window.location.href = 'login.html', 2000);
            })
            .catch((error) => Swal.fire('Error', error.message, 'error'));
    });
}

// ========================== SIGN IN ==========================
let getlbtn = document.getElementById('lbtn');
if (getlbtn) {
    getlbtn.addEventListener('click', () => {
        let email = document.getElementById('lemail').value.trim();
        let password = document.getElementById('lpassword').value.trim();

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                Swal.fire({ icon: 'success', title: 'Login Successful', timer: 2000, showConfirmButton: false });
                setTimeout(() => window.location.href = 'index.html', 2000);
            })
            .catch((error) => Swal.fire('Error', error.message, 'error'));
    });
}

// ========================== AUTH STATE CHECK ==========================
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            UserId = user.uid;
            const dashboard = document.getElementById('dashboard');
            const loginBtns = document.getElementById('loginbtns');
            if (dashboard && loginBtns) {
                dashboard.style.display = 'flex';
                loginBtns.style.display = 'none';
            }
        }
    });
});

// ========================== LOGOUT ==========================
let logout = document.getElementById('logout');
if (logout) {
    logout.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                Swal.fire({ icon: 'success', title: 'Signed Out', timer: 2000, showConfirmButton: false });
                setTimeout(() => window.location.href = 'index.html', 2000);
            })
            .catch((error) => Swal.fire('Error', error.message, 'error'));
    });
}

// ========================== GOOGLE LOGIN ==========================
const provider = new GoogleAuthProvider();
let googlesignup = document.getElementById("googleBtn");
if (googlesignup) {
    googlesignup.addEventListener("click", async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            Swal.fire({ icon: 'success', title: `Welcome ${user.displayName}!`, timer: 2000, showConfirmButton: false });
            setTimeout(() => window.location.href = 'index.html', 2000);
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    });
}

// ========================== PAGE ACCESS CONTROL ==========================
const publicPages = ["index.html", "signup.html", "login.html"];
const currentPage = window.location.pathname.split("/").pop();
onAuthStateChanged(auth, (user) => {
    if (!user && !publicPages.includes(currentPage)) {
        window.location.href = "login.html";
    }
});

// ========================== ADD PRODUCT ==========================
let getAddproductbtn = document.getElementById('Addproduct');
if (getAddproductbtn) {
    getAddproductbtn.addEventListener('click', async () => {
        let ProductName = document.getElementById('ProductName').value.trim();
        let ProductDetails = document.getElementById('ProductDetails').value.trim();
        let ProductPrice = document.getElementById('ProductPrice').value.trim();
        let ProductImage = document.getElementById('ProductImage').value.trim();

        if (ProductName && ProductDetails && ProductPrice && ProductImage) {
            try {
                await addDoc(collection(db, "Product"), { UserId, ProductName, ProductDetails, ProductPrice, ProductImage });
                Swal.fire({ icon: 'success', title: 'Product added successfully', timer: 2000, showConfirmButton: false });
                setTimeout(() => window.location.reload(), 2000);
            } catch (e) {
                Swal.fire('Error', e, 'error');
            }
        } else {
            Swal.fire('Warning', 'Please fill all fields', 'warning');
        }
    });
}

// ========================== SHOW ALL PRODUCTS ==========================
let productshow = document.getElementById('productshow');
if (productshow) {
    const querySnapshot = await getDocs(collection(db, "Product"));
    querySnapshot.forEach((docSnap) => {
        let productdata = docSnap.data();
        productshow.innerHTML += `
        <div class="group relative bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div class="w-full min-h-80 bg-gray-200 rounded-md overflow-hidden">
                <img src="${productdata.ProductImage}" class="w-full h-full object-cover">
            </div>
            <div class="mt-4 flex justify-between">
                <h1 class="text-sm text-gray-700">${productdata.ProductName}</h1>
                <p class="text-sm font-medium text-gray-900">${productdata.ProductPrice}$</p>
            </div>
            <div class="mt-4">
                <button onclick="addtocard('${docSnap.id}')" class="w-full bg-indigo-600 rounded-md py-2 px-4 text-white">
                    Add To Cart
                </button>
            </div>
        </div>`;
    });
}

// ========================== SHOW USER PRODUCTS ==========================
let productcards = document.getElementById('productcards');
if (productcards) {
    const querySnapshot = await getDocs(collection(db, "Product"));
    querySnapshot.forEach((docSnap) => {
        let productdata = docSnap.data();
        if (productdata.UserId === UserId) {
            productcards.innerHTML += `
            <div id="${docSnap.id}" class="w-[20vw] bg-white rounded-lg shadow-md">
                <img class="rounded-t-lg w-full h-56 object-cover" src="${productdata.ProductImage}">
                <div class="p-4">
                    <h5 class="text-lg font-semibold">${productdata.ProductName}</h5>
                    <span class="text-2xl font-bold">${productdata.ProductPrice}$</span>
                    <div class="flex gap-2 mt-3">
                        <button onclick="edit('${docSnap.id}')" class="flex-1 bg-blue-500 text-white rounded-lg px-4 py-2">Edit</button>
                        <button onclick="del('${docSnap.id}')" class="flex-1 bg-red-600 text-white rounded-lg px-4 py-2">Delete</button>
                    </div>
                </div>
            </div>`;
        }
    });
}

// ========================== DELETE PRODUCT ==========================
async function del(id) {
    const confirm = await Swal.fire({ title: 'Are you sure?', text: 'This will delete the product permanently.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete it!' });
    if (confirm.isConfirmed) {
        await deleteDoc(doc(db, "Product", id));
        Swal.fire({ icon: 'success', title: 'Product deleted', timer: 2000, showConfirmButton: false });
        setTimeout(() => window.location.reload(), 2000);
    }
}
window.del = del;

// ========================== EDIT PRODUCT ==========================
var editId;
async function edit(eid) {
    editId = eid;
    document.getElementById('editModal').style.display = 'flex';
    const docSnap = await getDoc(doc(db, "Product", eid));
    if (docSnap.exists()) {
        let data = docSnap.data();
        document.getElementById('editName').value = data.ProductName;
        document.getElementById('editDetails').value = data.ProductDetails;
        document.getElementById('editPrice').value = data.ProductPrice;
        document.getElementById('editImage').value = data.ProductImage;
    }
}
window.edit = edit;

let Updatebtn = document.getElementById('Updateproduct');
if (Updatebtn) {
    Updatebtn.addEventListener('click', async () => {
        await updateDoc(doc(db, "Product", editId), {
            ProductName: document.getElementById('editName').value.trim(),
            ProductDetails: document.getElementById('editDetails').value.trim(),
            ProductPrice: document.getElementById('editPrice').value.trim(),
            ProductImage: document.getElementById('editImage').value.trim()
        });
        Swal.fire({ icon: 'success', title: 'Product updated successfully', timer: 2000, showConfirmButton: false });
        setTimeout(() => window.location.reload(), 2000);
    });
}

let editformclose = document.getElementById('editformclose');
if (editformclose) {
    editformclose.addEventListener('click', () => {
        document.getElementById('editModal').style.display = 'none';
    });
}

// ========================== ADD TO CART ==========================
window.addtocard = async function (id) {
    try {
        await addDoc(collection(db, "addtocart"), { productid: id, UserId });
        Swal.fire({ icon: 'success', title: 'Product added to cart', timer: 2000, showConfirmButton: false });
        setTimeout(() => window.location.reload(), 2000);
    } catch (e) {
        Swal.fire('Error', e, 'error');
    }
};

// ========================== SHOW CART ITEMS ==========================
let cartitem = document.getElementById('cartitem');
if (cartitem) {
    let subtotal = 0;
    const cartSnapshot = await getDocs(collection(db, "addtocart"));
    let userCart = cartSnapshot.docs.filter(docSnap => docSnap.data().UserId === UserId);

    for (let cartDoc of userCart) {
        let productSnap = await getDoc(doc(db, "Product", cartDoc.data().productid));
        if (productSnap.exists()) {
            let p = productSnap.data();
            cartitem.innerHTML += `
            <div class="flex items-center justify-between border-b pb-4">
                <div class="flex items-center space-x-4">
                    <img src="${p.ProductImage}" class="w-20 h-20 rounded object-cover">
                    <div>
                        <h2 class="text-lg font-semibold">${p.ProductName}</h2>
                        <p class="text-sm font-semibold">${p.ProductPrice}$</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <input type="number" value="1" class="w-16 border rounded p-1 text-center">
                    <button onclick="delcart('${cartDoc.id}')" class="text-red-500"><i class="fas fa-trash"></i></button>
                </div>
            </div>`;
            subtotal += Number(p.ProductPrice);
            document.getElementById('stotal').innerHTML = subtotal + "$";
            document.getElementById('total').innerHTML = subtotal + 10 + '$';
        }
    }
}

// ========================== DELETE CART ITEM ==========================
async function delcart(id) {
    const confirm = await Swal.fire({ title: 'Remove item?', text: 'This item will be removed from your cart.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, remove it!' });
    if (confirm.isConfirmed) {
        await deleteDoc(doc(db, "addtocart", id));
        Swal.fire({ icon: 'success', title: 'Item removed', timer: 2000, showConfirmButton: false });
        setTimeout(() => window.location.reload(), 2000);
    }
}
window.delcart = delcart;

// ========================== CART COUNT ==========================
async function updateCartCount() {
    if (!UserId) return;
    const cartSnapshot = await getDocs(collection(db, "addtocart"));
    const userCart = cartSnapshot.docs.filter(docSnap => docSnap.data().UserId === UserId);
    let cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.innerHTML = userCart.length;
    }
}
onAuthStateChanged(auth, (user) => {
    if (user) {
        UserId = user.uid;
        updateCartCount();
    }
});
