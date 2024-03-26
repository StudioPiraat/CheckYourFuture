window.fsAttributes = window.fsAttributes || [];
	window.fsAttributes.push([
  'cmsfilter',
  (filterInstances) => {
    console.log('cmsfilter Successfully loaded!');
    
    $(".post_list").shuffleChildren();

    filterInstances.forEach((filterInstance) => {
      filterInstance.listInstance.on('renderitems', () => {
        console.log("Filters are updated!");
        setTimeout(() => {
        	AddBuitenJeBubbelCard();
        }, 0);
      });
    });
  },
]);

function AddBuitenJeBubbelCard(){
console.log("AddBuitenJeBubbelCard() loopt nu!");

  let postList = document.querySelector('.post_list');
  let isOnlyActiveFilterGroup = true;
  if (!postList) {
    console.error("Could not find post-list element!");
    return;
  }

  removeAllBuitenJeBubbelCards(postList);

	let sectorFilters = findAllCheckboxesWithinElement(document.getElementById('sector-checkboxes'));
  let studierichtingFilters = findAllCheckboxesWithinElement(document.getElementById('studierichting-checkboxes'));
  let niveauFilters = findAllCheckboxesWithinElement(document.getElementById('niveau-checkboxes'));
  let studiegerelateerdFilters = findAllCheckboxesWithinElement(document.getElementById('studiegerelateerd-checkboxes'));
    
  	let allChecked = true;
  	let allUnchecked = true;

    sectorFilters.forEach(filter => {
      const checkbox = document.getElementById(filter.id);
      const parentElement = checkbox.parentElement;

      if (parentElement.classList.contains('fs-cmsfilter_active')) {
      	isOnlyActiveFilterGroup = false;
        allUnchecked = false;
      } else {
        allChecked = false;
      }
    });
    
    studierichtingFilters.forEach(filter => {
      const checkbox = document.getElementById(filter.id);
      const parentElement = checkbox.parentElement;

      if (parentElement.classList.contains('fs-cmsfilter_active')) {
      	isOnlyActiveFilterGroup = false;
        allUnchecked = false;
      } else {
        allChecked = false;
      }
    });
    
    studiegerelateerdFilters.forEach(filter => {
      const checkbox = document.getElementById(filter.id);
      const parentElement = checkbox.parentElement;

      if (parentElement.classList.contains('fs-cmsfilter_active')) {
      	isOnlyActiveFilterGroup = false;
        allUnchecked = false;
      } else {
        allChecked = false;
      }
    });
    
    niveauFilters.forEach(filter => {
      const checkbox = document.getElementById(filter.id);
      const parentElement = checkbox.parentElement;

      if (parentElement.classList.contains('fs-cmsfilter_active')) {
        allUnchecked = false;
      } else {
        allChecked = false;
      }
    });
    
    if (allChecked || allUnchecked) {
      return 'break';
    }

  let firstNumberElement = document.getElementById('results-count');
  let firstNumber = parseInt(firstNumberElement.innerText.trim());
  console.log("Adding Buiten je Bubbel cards!");
  let secondNumber = calculateSecondNumber(firstNumber);
  console.log("Should add " + secondNumber + " Buiten je Bubbel cards!");

  // Select all Buiten je Bubbel cards
  let buitenJeBubbelCards = document.querySelectorAll('.buiten-je-bubbel');
  if (buitenJeBubbelCards.length === 0) {
    console.error("No Buiten je Bubbel cards found!");
    return;
  }

  // Function to check if card matches unchecked filters
  function matchesUncheckedFilters(card) {
  	//let isOnlyActiveFilterGroup = true;
    console.log("is niveau enige filter? ", isOnlyActiveFilterGroup);
    let tags = card.querySelectorAll('.bjb_tag');

		if(!areAllOrNoneCheckboxesChecked(document.getElementById('sector-checkboxes'))){
    	console.log("taking sectors into account!");
      for (let tag of tags) {
        console.log("now checking tag " + tag.innerText);
        for (let filter of sectorFilters) {
          let checkbox = document.getElementById(filter.id);
          if(checkbox.nextElementSibling.innerText == tag.innerText){
            if(checkbox.parentNode.classList.contains("fs-cmsfilter_active")){
              return false;
            }
          }
        }
      }
    }

		if(!areAllOrNoneCheckboxesChecked(document.getElementById('studierichting-checkboxes'))){
    	console.log("taking studierichting into account!");
      for (let filter of studierichtingFilters) {
        let tag = card.querySelector('.bjb_richting');
        let checkbox = document.getElementById(filter.id);
        if(checkbox.nextElementSibling.innerText == tag.innerText){
          if(checkbox.parentNode.classList.contains("fs-cmsfilter_active")){
            return false;
          }
        }
      }
    }
    
    if(!areAllOrNoneCheckboxesChecked(document.getElementById('studiegerelateerd-checkboxes'))){
    	console.log("taking studiegeralteerd into account!");
      for (let filter of studiegerelateerdFilters) {
        let tag = card.querySelector('.bjb_studiegerelateerd');
        let checkbox = document.getElementById(filter.id);
        if(checkbox.nextElementSibling.innerText == tag.innerText){
          if(checkbox.parentNode.classList.contains("fs-cmsfilter_active")){
            return false;
          } 
        }
      }
    }
    
    if(!areAllOrNoneCheckboxesChecked(document.getElementById('niveau-checkboxes'))){
      if (isOnlyActiveFilterGroup){
        for (let filter of niveauFilters) {
          let tag = card.querySelector('.bjb_niveau');
          let checkbox = document.getElementById(filter.id);
          if(checkbox.nextElementSibling.innerText == tag.innerText){
            if(checkbox.parentNode.classList.contains("fs-cmsfilter_active")){
              console.log("zelfde niveau, mag niet!");
              return false;
            }
          } else if(checkbox.nextElementSibling.innerText == "MBO" && tag.innerText =="WO"){
            if(!document.getElementById('hbo-checkbox').parentNode.classList.contains("fs-cmsfilter_active")){
              return false;
            }
          }
        }
      } else {
        for (let filter of niveauFilters) {
          let tag = card.querySelector('.bjb_niveau');
          let checkbox = document.getElementById(filter.id);
          if(checkbox.nextElementSibling.innerText == "MBO" && tag.innerText =="WO"){
            if(!document.getElementById('hbo-checkbox').parentNode.classList.contains("fs-cmsfilter_active")){
              return false;
            }
          }
        }
      }
    }
    
    console.log("ignoring card");
    return true;
  }

  let addedCards = 0;
  let matchingCardsFound = false;

  shuffleArray(buitenJeBubbelCards);

  for (let i = 0; i < buitenJeBubbelCards.length && addedCards < secondNumber; i++) {
    let randomCard = buitenJeBubbelCards[i];
    console.log("Checking Buiten je Bubbel card:", randomCard);

    if (matchesUncheckedFilters(randomCard)) {
      let duplicateCard = randomCard.cloneNode(true);
      postList.appendChild(duplicateCard);
      addedCards++;
      matchingCardsFound = true;
    }
  }

  if (!matchingCardsFound) {
    console.log("No matching cards found.");
  }
  
  $(".post_list").shuffleChildren();
  
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function removeAllBuitenJeBubbelCards(parentElement) {
  let buitenJeBubbelCards = parentElement.querySelectorAll('.buiten-je-bubbel');
  
  buitenJeBubbelCards.forEach(card => {
    card.parentNode.removeChild(card);
  });
}

function areAllOrNoneCheckboxesChecked(parentId) {
  
  // get all checkboxes in any (grand)children
  let checkboxes = findAllCheckboxesWithinElement(parentId);
  let allChecked = true;
  let noneChecked = true;
  
  for (let checkbox of checkboxes) {
  console.log("checking ", checkbox.parentElement);
    if (checkbox.parentElement.classList.contains('fs-cmsfilter_active')) {
    	console.log("HEBBES!");
      noneChecked = false; // At least one checkbox is checked
    } else {
      allChecked = false; // At least one checkbox is unchecked
    }
  }

	console.log(parentId, ", allChecked = ", allChecked, ", noneChecked = ", noneChecked);
  return allChecked || noneChecked;

}

function calculateSecondNumber(firstNumber) {
    let secondNumber = (firstNumber > 0) ? 1 : 0;
    secondNumber += Math.floor(firstNumber / 8);
    return secondNumber;
}

  function findAllCheckboxesWithinElement(element) {
  	console.log("finding checkboxes in ", element);
    var checkboxes = [];

    function traverse(element) {
    	if (element && element.childNodes) {
        var children = element.childNodes;
        for (var i = 0; i < children.length; i++) {
          var child = children[i];
          if (child.nodeType === 1) { 
            if (child.tagName.toLowerCase() === 'input' && child.type === 'checkbox') {
              checkboxes.push(child);
            } else {
              traverse(child);
            }
          }
        }
      }
    }

    traverse(element);
    console.log("found ", checkboxes.length, " in ", element);
    return checkboxes;
  }