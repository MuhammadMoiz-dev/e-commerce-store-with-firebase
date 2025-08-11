import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCn3ogWlNH1TkxuJJae8irIGp9Fon-IoU4",
    authDomain: "shopping-c8327.firebaseapp.com",
    projectId: "shopping-c8327",
    storageBucket: "shopping-c8327.firebasestorage.app",
    messagingSenderId: "402376993306",
    appId: "1:402376993306:web:0768b1b73e94c828f73fa3",
    measurementId: "G-SW78KSGN7T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// SIGNUP CODE
let getsbtn = document.getElementById('sbtn')
if (getsbtn) {
    let email = document.getElementById('semail')
    let password = document.getElementById('spassword')
    getsbtn.addEventListener('click', () => {

        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                alert('Signup Successful')
                window.location.href = 'login.html'
                email.value = ""
                password.value = ""

            })
            .catch((error) => {
                email.value = ""
                password.value = ""
                alert(error.message)
            });
    })
}

// SIGN IN CODE
let getlbtn = document.getElementById('lbtn')
if (getlbtn) {
    getlbtn.addEventListener('click', () => {
        let email = document.getElementById('lemail').value
        let password = document.getElementById('lpassword').value
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                alert('Login Successful')
                window.location.href = 'index.html'
                email = ""
                password = ""
            })
            .catch((error) => {
                alert(error)
                email = ""
                password = ""
            });
    })
}

let UserId;
// CHECK USER LOGIN OR NOT

document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            UserId = uid;
            const dashboard = document.getElementById('dashboard');
            const loginBtns = document.getElementById('loginbtns');

            if (dashboard && loginBtns) {
                dashboard.style.display = 'flex';
                loginBtns.style.display = 'none';
            }
        }
    });
});

// LOGOUT CODE
let logout = document.getElementById('logout')
if (logout) {
    logout.addEventListener('click', () => {

        signOut(auth)
            .then(() => {
                alert("User signed out successfully.");
                window.location.href = 'index.html'
            })
            .catch((error) => {
                console.error("Error signing out:", error);
            });
    })
}


// Google Auth Provider
const provider = new GoogleAuthProvider();

// Button Click
let googlesignup = document.getElementById("googleBtn")
if (googlesignup) {

    googlesignup.addEventListener("click", async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("User Info:", user);
            alert(`Welcome ${user.displayName}!`);
            window.location.href = 'index.html'
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
    });
}

// List of public pages (no login required)
const publicPages = ["index.html", "signup.html", "login.html"];

// Get current page filename
const currentPage = window.location.pathname.split("/").pop();

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // User is NOT logged in
        if (!publicPages.includes(currentPage)) {
            // Redirect to login if trying to access a restricted page
            window.location.href = "login.html";
        }
    }
});

// PRODUCT ADD ON FIRESTORE DATABASE
let getAddproductbtn = document.getElementById('Addproduct');

if (getAddproductbtn) {
    getAddproductbtn.addEventListener('click', async () => {

        let ProductNameEl = document.getElementById('ProductName');
        let ProductDetailsEl = document.getElementById('ProductDetails');
        let ProductPriceEl = document.getElementById('ProductPrice');
        let ProductImageEl = document.getElementById('ProductImage');

        let ProductName = ProductNameEl.value.trim();
        let ProductDetails = ProductDetailsEl.value.trim();
        let ProductPrice = ProductPriceEl.value.trim();
        let ProductImage = ProductImageEl.value.trim();

        if (ProductName && ProductDetails && ProductPrice && ProductImage) {
            try {
                const docRef = await addDoc(collection(db, "Product"), {
                    UserId,
                    ProductName,
                    ProductDetails,
                    ProductPrice,
                    ProductImage,
                });
                alert('Product add successful');

                // Clear fields after success
                ProductNameEl.value = '';
                ProductDetailsEl.value = '';
                ProductPriceEl.value = '';
                ProductImageEl.value = '';

                window.location.reload();
            } catch (e) {
                alert(`Error adding document: ${e}`);
            }
        } else {
            alert('Please fill all fields');
        }
    });
}



let productshow = document.getElementById('productshow')
if (productshow) {

    const querySnapshot = await getDocs(collection(db, "Product"));
    querySnapshot.forEach((doc) => {
        let productdata = doc.data()
        productshow.innerHTML += `
    <div
    class="group relative bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
    <div
    class="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden  lg:h-80 lg:aspect-none">
    <img src="${productdata.ProductImage}"
    alt="Front of men's Basic Tee in black."
    class="w-full h-full object-center object-cover lg:w-full lg:h-full">
    </div>
    <div class="mt-4 flex justify-between">
    <div>
    <h1 class="text-sm text-gray-700">
    <span aria-hidden="true" class="absolute inset-0"></span>
    ${productdata.ProductName}
    </h1>
    </div>
    <p class="text-sm font-medium text-gray-900">${productdata.ProductPrice}$</p>
    </div>
    <div class="mt-4">
    <button onclick="addtocard('${doc.id}')"
    style="cursor: pointer; position: relative; z-index: 999;"
    class="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
    Add To Cart
</button>
    </div>
    </div>`
    });
}
let productcards = document.getElementById('productcards');

// Assume that you have the current user's ID available (e.g., from Firebase Authentication)

if (productcards) {

    const querySnapshot = await getDocs(collection(db, "Product"));

    querySnapshot.forEach((doc) => {
        let productdata = doc.data();

        // Check if the product's UserId matches the current logged-in user's UserId
        if (productdata.UserId === UserId) {
            productcards.innerHTML += ` 
            <div id="${doc.id}" class="w-[20vw] bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-100">
                <a href="#">
                    <img class="rounded-t-lg w-full h-56 object-cover" src="${productdata.ProductImage}" alt="Product Image">
                </a>
                <div class="p-4">
                    <a href="#">
                        <h5 class="text-lg font-semibold tracking-tight text-gray-900 hover:text-blue-600">
                            ${productdata.ProductName}
                        </h5>
                    </a>

                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-gray-900">${productdata.ProductPrice}$</span>
                    </div>
                    <div class="flex gap-2 mt-3">
                        <button onclick="edit('${doc.id}')" id='updatebtn' class="flex-1 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-4 py-2">
                            Edit
                        </button>
                        <button onclick="del('${doc.id}')" class="flex-1 text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            `;
        }
    });
}


async function del(e) {

    await deleteDoc(doc(db, "Product", String(e)))
        .then(() => {
            window.location.reload();
        })

}

window.del = del
var editId;

async function edit(eid) {
    editId = eid;
    document.getElementById('editModal').style.display = 'flex';

    let editName = document.getElementById('editName');
    let editDetails = document.getElementById('editDetails');
    let editPrice = document.getElementById('editPrice');
    let editImage = document.getElementById('editImage');

    const docRef = doc(db, "Product", eid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let productdata = docSnap.data();
        editName.value = productdata.ProductName;
        editDetails.value = productdata.ProductDetails;
        editPrice.value = productdata.ProductPrice;
        editImage.value = productdata.ProductImage;
    } else {
        alert("No such product found!");
    }
}
window.edit = edit
// update data
let Updatebtn = document.getElementById('Updateproduct');
if (Updatebtn) {
    let editName = document.getElementById('editName');
    let editDetails = document.getElementById('editDetails');
    let editPrice = document.getElementById('editPrice');
    let editImage = document.getElementById('editImage');

    Updatebtn.addEventListener('click', async () => {

        const docRef = doc(db, "Product", editId);

        await updateDoc(docRef, {
            ProductName: editName.value.trim(),
            ProductDetails: editDetails.value.trim(),
            ProductPrice: editPrice.value.trim(),
            ProductImage: editImage.value.trim()
        });

        alert("Product updated successfully!");
        window.location.reload();
    });
}

let editformclose = document.getElementById('editformclose')
if (editformclose) {

    editformclose.addEventListener('click', () => {
        document.getElementById('editModal').style.display = 'none'
    })

}
let productcount = 0
window.addtocard = async function (id) {
    let cartCount = document.getElementById('cartCount')
    cartCount.innerHTML = productcount
    console.log("Added to cart:", id);
    try {
        const docRef = await addDoc(collection(db, "addtocart"), {
            productid:id,
            UserId
        });
        alert('Product add successful');
        window.location.reload();
    } catch (e) {
        alert(`Error adding document: ${e}`);
    }
};

