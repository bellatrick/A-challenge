const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnsOpenModal = document.querySelector(".show-modal");
const productsList = document.querySelector(".productList");
const productName = document.querySelector(".productName");
const reviewsContainer = document.querySelector(".reviews");
const container = document.querySelector(".container");
const ratingDiv = document.querySelector(".ratingDiv");
const reviewTextInput = document.querySelector(".review");
const loading=document.querySelector('.loading')
const error=document.querySelector('.error')
const form = document.querySelector(".form");
const averageRatingNumber = document.querySelector(".ratingNumber");
let userRating;
let showProduct
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};
btnsOpenModal.addEventListener("click", openModal);
//btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

const starRatingCalc = (str) => {
  let roundHalf = (num) => {
    return Math.round(num * 2) / 2;
  };
  if (str > 5.0) return "average rating greater than 5.00";

  let actualRating = roundHalf(str);
  const result = [];

  const rateMappings = {
    0: ' <i class="fa fa-star-o"></i>',
    0.5: '<i class="fa fa-star-half-o"></i>',
    1: '<i class="fa fa-star"></i>',
  };

  for (let i = 1; i <= 5; i++) {
    const difference = actualRating;
    actualRating = actualRating - 1;

    if (difference > 0.5) {
      result.push(rateMappings[1]);
    } else if (difference === 0.5) {
      result.push(rateMappings[0.5]);
    } else {
      result.push(rateMappings[0]);
    }
  }

  return result.join(" ");
};
const firebaseConfig = {
  apiKey: "AIzaSyDl1o1Q3bELfKNHwnCKFPM0U2NLSFznwNQ",
  authDomain: "gumroad-daae9.firebaseapp.com",
  projectId: "gumroad-daae9",
  storageBucket: "gumroad-daae9.appspot.com",
  messagingSenderId: "385083137697",
  databaseURL: "https://gumroad-daae9-default-rtdb.firebaseio.com",
  appId: "1:385083137697:web:b75eaf8255f93eb3ce5ae0",
};
firebase.initializeApp(firebaseConfig);
let productID;
const dbRef = firebase.database().ref();
const productsRef = dbRef.child("products");

let reviewsDetails;
function userClicked(e) {
    container.classList.remove("hidden");
    productID = e.target.getAttribute("child-key");
  
    productRef = dbRef.child("products/" + productID);
     showProduct=(snap) => {
      productName.innerHTML = e.target.innerHTML;
  
      let productObj = snap.val();
     
      if (productObj!==Object(productObj)) return;
      const productArr= Object.values(productObj)
     
      reviewsDetails = productArr.flatMap(products=>products).map(
        ({number,text}) =>
          ` <div class="addedReviews">
       <span>
          ${starRatingCalc(parseInt(number))}
       </span>
       <span class="storedReviewNumber">${number}</span>
       <span class="reviewText">-${text}</span>
     </div>`
      )
      
      reviewsContainer.innerHTML = reviewsDetails.join(' ');
      const reviewNumber = productArr.flatMap(products=>products)
        .map(({ number }) => number)
        .reduce((a, b) => a + b, 0);
        averageRatingNumber.innerHTML = (reviewNumber / productArr.length).toFixed(1);
      const averageRating = ` <span
    ${starRatingCalc(Math.round(parseInt(reviewNumber / productArr.length)))}
    </span>`;
      ratingDiv.innerHTML = averageRating;
      
    };
    productRef.on("child_added", showProduct)
   
  
  }
  
  async function addBookList(){
   await productsRef.on("child_added", (snap) => {
      
      let productItem = snap.val();
      let li = document.createElement("li");
    
      li.innerHTML = productItem.name;
      li.setAttribute("child-key", snap.key);
      li.addEventListener("click", userClicked);
      productsList.append(li);
      if(productsList){
        loading.classList.add('hidden')
      }
    }
    );
    
  }
  addBookList()
  const starRating = [...document.getElementsByClassName("rating__star")];
  
  function executeRating(stars) {
    const starClassActive = "rating__star fas fa-star stars";
    const starClassUnactive = "rating__star far fa-star stars";
    const starsLength = stars.length;
    let i;
    stars.map((star) => {
    const starHandler = () => {
      console.log('clicked');
        i = stars.indexOf(star);
  
        if (star.className.indexOf(starClassUnactive) !== -1) {
          printRatingResult(i + 1);
          for (i; i >= 0; i--) stars[i].className = starClassActive;
        } else {
          printRatingResult(i);
          for (i; i < starsLength; i++) stars[i].className = starClassUnactive;
        }
      };
      star.addEventListener('click', ()=>starHandler())
    });
  }
  
  executeRating(starRating);
  
  function printRatingResult(number) {
    userRating = number;
    return number;
  }
  
  const submitHandler = (e) => {
    error.classList.add('hidden')
    e.preventDefault();
   if(!userRating) {error.classList.remove('hidden')
  return}
    starRating.forEach(
      (star) => (star.className = "rating__star far fa-star stars")
    );
  
    closeModal();
    
    const productRefItem= dbRef.child('products/' + productID)
    const productRef = dbRef.child("products/" + productID + "/Reviews");
    const ratingObj = [
      {
        text: reviewTextInput.value,
        number: userRating,
      },
    ];
    productRef.push(ratingObj);
    productRefItem.on('child_added', showProduct)
    console.log(reviewTextInput.value, userRating);
    reviewTextInput.value = "";
  };
  form.addEventListener("submit", submitHandler);
  