
const main = document.querySelector('main');
const bottomSection = document.querySelector('.bottom-section');
const topSection = document.querySelector('.top-section');
/* set limit of data on first display */
let limit = 20;


// Déclaration de la fonction asynchrone qui permettra, une fois appelée, de récupérer les données des différents jobs
async function loadJobs() {
    const response = await fetch('assets/data/data.json');
    let jobs = await response.json();
    if(jobs.length > 0) {
        
        let jobContent = "";

        /* filtre du titre du job selon l'option choisie à partir du picker */
        posteFilter(jobs);
        /* filtre du type de contrat selon l'option choisie à partir du picker */
        contractFilter(jobs);
        /* filtre du type de télétravail selon l'option choisie à partir du picker */
        remoteFilter(jobs); 

        /* trie des jobs selon l'option choisie à partir du picker */
        setSortByPickerList(jobs);
   
         /* vérification du tri par défaut - quand on arrive sur la page - (date ou salaire) */
         const sortByPicker = document.querySelector('.active-sort-by');
         /* ordre par DATE */
         if(sortByPicker.dataset.active === "salaire") {
           jobs.sort((a, b) => b.salary - a.salary);
         } else if(sortByPicker.dataset.active === "date") {
           jobs.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
         }
        
             /* display next data */

main.addEventListener("scroll", () => {

    if (main.scrollTop >= bottomSection.clientHeight - (topSection.clientHeight * 5)) {
        /* display 10 next jobs each time user get to the bottom section */ 
        limit+= 10;
        filterJobs(jobs);
     } 
    })

         const spliceJobs = jobs.splice(0, limit);
      
        spliceJobs.forEach(job => {

            /*
                Traitement des données avant insertion au niveau des balises HTML
            */

            // récupération de la première lettre de la société (en majuscule)
            const ucfirstCompany = job.company.charAt(0).toUpperCase();

            // récupération du nom complet de la société (Première lettre en majuscule)
            const companyName = ucfirstCompany + job.company.slice(1).toLowerCase();

            // récupération de la localisation du poste
            const city = job.city;

            // récupération du titre du job (donnée brute)
            const dataJobTitle = job.jobTitle;
            // stockage du nouveau label correspondant à la donnée brute récupérée
            const jobTitle = findCorrespondingJobLabel(dataJobTitle);

            // récupération du type de télétravail (donnée brute)
            const dataRemoteWork = job.remoteWork;
            // stockage du nouveau label correspondant à la donnée brute récupérée
            const remoteWorkLabelAndClass = findCorrespondingRemoteLabel(dataRemoteWork);
            let textRemoteWork = "";
            if(remoteWorkLabelAndClass.label !== null) {
                textRemoteWork = `<p class="remote-work ${remoteWorkLabelAndClass.class}">${remoteWorkLabelAndClass.label}</p>`;
            }

            // récupération du type de contrat (donnée brute)
            const dataContract = job.contractType;
            // stockage du nouveau label correspondant à la donnée brute récupérée
            const contract = findCorrespondingContractLabel(dataContract);

            let salary = "";

            if(typeof(job.salary) === "number") {
                // récupération du salaire (donnée brute)
                salary = job.salary;
            }

            // récupération de la date de publication (donnée brute)
            const publishDateData = job.publishDate;
            // stockage du nouveau label correspondant à la donnée brute récupérée
            const publishDate = changeDateInDaysOrMonthsOrYearsAgo(publishDateData);

            // récupération de la date de début du poste (donnée brute)
            const startDateData = job.startDate;
            // stockage du nouveau label correspondant à la donnée brute récupérée
            const startDate = changeFormatStartDate(startDateData);

            // récupération du niveau d'études (donnée brute)
            const studyLevel = job.studyLevel;

            // récupération de la description de l'offre (donnée brute)
            const about = job.about;

            jobContent += `<article class="job-container">
            <div class="job-resume">
                <p class="job-icon">
                    ${ucfirstCompany}
                </p>
                <div class="job-infos-resume">
                    <div class="left-infos">
                        <div class="job-title-remote-container">
                            <h3>${jobTitle}</h3>
                            ${textRemoteWork}
                        </div>
                        <div class="job-subtitle-container subtitle">
                            <p>${companyName}</p> <span class="separator">-</span> <p>${city}</p> <div class="line"></div> <p>${contract}</p>
                        </div>
                    </div>
                    <div class="right-infos">
                        <div class="salary-container subtitle">
                            <p>Salaire</p>
                            <span class="salary-amount">${salary}k</span>
                        </div>
                        <p class="published-date subtitle">${publishDate}</p>
                    </div>
                </div>
            </div>
            <div class="job-details">
                <div class="top-details">
                    <ul>
                        <li><img class="arrow" src="assets/imgs/city.svg" alt="">
                            <p>${companyName}</p> <span class="separator">-</span> <p>${city}</p>
                        </li>
                        <li><img class="arrow" src="assets/imgs/contract.svg" alt="">
                            ${contract}
                        </li>
                        <li><img class="arrow" src="assets/imgs/date-start.svg" alt="">
                            Début : ${startDate}
                        </li>
                        <li><img class="arrow" src="assets/imgs/stude.svg" alt="">
                            Bac +${studyLevel}
                        </li>
                    </ul>
                    <p class="published-date">Publié ${publishDate.charAt(0).toLowerCase() + publishDate.slice(1)}</p>
                </div>
                <p class="job-description">
                    ${about}
                </p>
                <div class="apply-container">
                    <a class="apply" href="">Postuler</a>
                </div>
            </div>
        </article>`
        })

        const jobsContainer = document.querySelector('.jobs-container');
        jobsContainer.innerHTML = jobContent;
        
        seeDetails();
       
    }


}

// Appel de la fonction loadJobs()
loadJobs();


function displaySortBy(jobs) {

    let jobContent = "";
 
    const spliceJobs = jobs.splice(0, limit);

     spliceJobs.forEach(job => {

         /*
             Traitement des données avant insertion au niveau des balises HTML
         */

         // récupération de la première lettre de la société (en majuscule)
         const ucfirstCompany = job.company.charAt(0).toUpperCase();

         // récupération du nom complet de la société (Première lettre en majuscule)
         const companyName = ucfirstCompany + job.company.slice(1).toLowerCase();

         // récupération de la localisation du poste
         const city = job.city;

         // récupération du titre du job (donnée brute)
         const dataJobTitle = job.jobTitle;
         // stockage du nouveau label correspondant à la donnée brute récupérée
         const jobTitle = findCorrespondingJobLabel(dataJobTitle);

         // récupération du type de télétravail (donnée brute)
         const dataRemoteWork = job.remoteWork;
         // stockage du nouveau label correspondant à la donnée brute récupérée
         const remoteWorkLabelAndClass = findCorrespondingRemoteLabel(dataRemoteWork);
         let textRemoteWork = "";
         if(remoteWorkLabelAndClass.label !== null) {
             textRemoteWork = `<p class="remote-work ${remoteWorkLabelAndClass.class}">${remoteWorkLabelAndClass.label}</p>`;
         }

         // récupération du type de contrat (donnée brute)
         const dataContract = job.contractType;
         // stockage du nouveau label correspondant à la donnée brute récupérée
         const contract = findCorrespondingContractLabel(dataContract);

         let salary = "";

         if(typeof(job.salary) === "number") {
             // récupération du salaire (donnée brute)
             salary = job.salary;
         }

         // récupération de la date de publication (donnée brute)
         const publishDateData = job.publishDate;
         // stockage du nouveau label correspondant à la donnée brute récupérée
         const publishDate = changeDateInDaysOrMonthsOrYearsAgo(publishDateData);

         // récupération de la date de début du poste (donnée brute)
         const startDateData = job.startDate;
         // stockage du nouveau label correspondant à la donnée brute récupérée
         const startDate = changeFormatStartDate(startDateData);

         // récupération du niveau d'études (donnée brute)
         const studyLevel = job.studyLevel;

         // récupération de la description de l'offre (donnée brute)
         const about = job.about;

         jobContent += `<article class="job-container">
         <div class="job-resume">
             <p class="job-icon">
                 ${ucfirstCompany}
             </p>
             <div class="job-infos-resume">
                 <div class="left-infos">
                     <div class="job-title-remote-container">
                         <h3>${jobTitle}</h3>
                         ${textRemoteWork}
                     </div>
                     <div class="job-subtitle-container subtitle">
                         <p>${companyName}</p> <span class="separator">-</span> <p>${city}</p> <div class="line"></div> <p>${contract}</p>
                     </div>
                 </div>
                 <div class="right-infos">
                     <div class="salary-container subtitle">
                         <p>Salaire</p>
                         <span class="salary-amount">${salary}k</span>
                     </div>
                     <p class="published-date subtitle">${publishDate}</p>
                 </div>
             </div>
         </div>
         <div class="job-details">
             <div class="top-details">
                 <ul>
                     <li><img class="arrow" src="assets/imgs/city.svg" alt="">
                         <p>${companyName}</p> <span class="separator">-</span> <p>${city}</p>
                     </li>
                     <li><img class="arrow" src="assets/imgs/contract.svg" alt="">
                         ${contract}
                     </li>
                     <li><img class="arrow" src="assets/imgs/date-start.svg" alt="">
                         Début : ${startDate}
                     </li>
                     <li><img class="arrow" src="assets/imgs/stude.svg" alt="">
                         Bac +${studyLevel}
                     </li>
                 </ul>
                 <p class="published-date">Publié ${publishDate.charAt(0).toLowerCase() + publishDate.slice(1)}</p>
             </div>
             <p class="job-description">
                 ${about}
             </p>
             <div class="apply-container">
                 <a class="apply" href="">Postuler</a>
             </div>
         </div>
     </article>`
     })

     const jobsContainer = document.querySelector('.jobs-container');
     jobsContainer.innerHTML = jobContent;

     seeDetails();
}

function updateSortBy(jobs) {

    const sortByPicker = document.querySelector('.active-sort-by');
    /* ordre par DATE */      
    if(sortByPicker.dataset.active === "salaire") {
      jobs.sort((a, b) => b["salary"] - a["salary"])
 

    } else if(sortByPicker.dataset.active === "date") {
      jobs.sort((a, b) => new Date(b["publishDate"]) - new Date(a["publishDate"]))
    }

    displaySortBy(jobs);
}


// Fonction qui permet de filtrer selon le titre du poste
function posteFilter(jobs) {
    const postePicker = document.querySelector('.poste-btn');
    const listJobTitle = document.querySelector('.list-job-title');

    const listContract = document.querySelector('.list-contract');
    const listRemote = document.querySelector('.list-remote');

    postePicker.addEventListener('click', () => {
        if(listJobTitle.dataset.state === "hidden") {
            listJobTitle.dataset.state = "visible";

    // fermeture des 2 autres listes (télétravail et type de contrat)
            listContract.dataset.state = "hidden";
            listRemote.dataset.state = "hidden";
        } else {
            listJobTitle.dataset.state = "hidden";
        }
    })
    

    const itemsJobTitle = listJobTitle.querySelectorAll('li');
    itemsJobTitle.forEach(item => {
   
        const activeFiltersContainer = document.querySelector('.active-filters-container');

        const activeFilter = document.createElement('button');
        activeFilter.classList.add('active-filter');
        activeFilter.dataset.state = "display-none";
        activeFilter.innerHTML = `<span>${item.textContent}</span><img class="clear-tag" src="assets/imgs/clear-tag.svg" alt="">`;
        activeFiltersContainer.appendChild(activeFilter);
        item.addEventListener('click', () => {

            let checkedIcon = item.querySelector('img');
            let checkbox = item.querySelector('.checkbox');

            if(item.dataset.check !== "checked") {
                activeFilter.dataset.state = "visible";
                item.dataset.check = "checked";
                checkedIcon.dataset.state = "visible";
                checkbox.dataset.state = "visible";
                activeFilter.addEventListener('click', () => {
                    activeFilter.dataset.state = "display-none";
                    item.dataset.check = "unchecked";
                    checkedIcon.dataset.state = "hidden";
                    checkbox.dataset.state = "hidden";
                    filterJobs(jobs);
                })
                filterJobs(jobs);

            } else {
                activeFilter.dataset.state = "display-none";
                item.dataset.check = "unchecked";
                checkedIcon.dataset.state = "hidden";
                checkbox.dataset.state = "hidden";
                filterJobs(jobs);
            }
        })
    })
}

// Fonction qui permet de filtrer selon le contract du poste
function contractFilter(jobs) {
    const contractPicker = document.querySelector('.contract-btn');
    const listContract = document.querySelector('.list-contract');

    const listJobTitle = document.querySelector('.list-job-title');
    const listRemote = document.querySelector('.list-remote');

    contractPicker.addEventListener('click', () => {
        if(listContract.dataset.state === "hidden") {
            listContract.dataset.state = "visible";

            //fermeture autres listes
            listJobTitle.dataset.state = "hidden";
            listRemote.dataset.state = "hidden";
        } else {
            listContract.dataset.state = "hidden";
        }
    })

    const itemsContract = listContract.querySelectorAll('li');
    itemsContract.forEach(item => {
        const activeFiltersContainer = document.querySelector('.active-filters-container');

        const activeFilter = document.createElement('button');
        activeFilter.classList.add('active-filter');
        activeFilter.dataset.state = "display-none";
        activeFilter.innerHTML = `<span>${item.textContent}</span><img class="clear-tag" src="assets/imgs/clear-tag.svg" alt="">`;
        activeFiltersContainer.appendChild(activeFilter);
        item.addEventListener('click', () => {

            let checkedIcon = item.querySelector('img');
            let checkbox = item.querySelector('.checkbox');

            if(item.dataset.check !== "checked") {
                activeFilter.dataset.state = "visible";
                item.dataset.check = "checked";
                checkedIcon.dataset.state = "visible";
                checkbox.dataset.state = "visible";
                activeFilter.addEventListener('click', () => {
                    activeFilter.dataset.state = "display-none";
                    item.dataset.check = "unchecked";
                    checkedIcon.dataset.state = "hidden";
                    checkbox.dataset.state = "hidden";
                    filterJobs(jobs);
                })
                filterJobs(jobs);
            } else {
                activeFilter.dataset.state = "display-none";
                item.dataset.check = "unchecked";
                checkedIcon.dataset.state = "hidden";
                checkbox.dataset.state = "hidden";
                filterJobs(jobs);
            }
        })
    })
}



// Fonction qui permet de filtrer selon le type de télétravail
function remoteFilter(jobs) {
    const remotePicker = document.querySelector('.remote-btn');
    const listRemote = document.querySelector('.list-remote');

    const listContract = document.querySelector('.list-contract');
    const listJobTitle = document.querySelector('.list-job-title');

    remotePicker.addEventListener('click', () => {
        if(listRemote.dataset.state === "hidden") {
            listRemote.dataset.state = "visible";

              //fermeture autres listes
              listJobTitle.dataset.state = "hidden";
              listContract.dataset.state = "hidden";
        } else {
            listRemote.dataset.state = "hidden";
        }
    })

    const itemsRemote = listRemote.querySelectorAll('li');
    itemsRemote.forEach(item => {
        const activeFiltersContainer = document.querySelector('.active-filters-container');

        const activeFilter = document.createElement('button');
        activeFilter.classList.add('active-filter');
        activeFilter.dataset.state = "display-none";
        activeFilter.innerHTML = `<span>${item.textContent}</span><img class="clear-tag" src="assets/imgs/clear-tag.svg" alt="">`;
        activeFiltersContainer.appendChild(activeFilter);
        item.addEventListener('click', () => {

            let checkedIcon = item.querySelector('img');
            let checkbox = item.querySelector('.checkbox');

            if(item.dataset.check !== "checked") {
                activeFilter.dataset.state = "visible";
                item.dataset.check = "checked";
                checkedIcon.dataset.state = "visible";
                checkbox.dataset.state = "visible";
                activeFilter.addEventListener('click', () => {
                    activeFilter.dataset.state = "display-none";
                    item.dataset.check = "unchecked";
                    checkedIcon.dataset.state = "hidden";
                    checkbox.dataset.state = "hidden";
                    filterJobs(jobs);
                })
               filterJobs(jobs);
            } else {
                activeFilter.dataset.state = "display-none";
                item.dataset.check = "unchecked";
                checkedIcon.dataset.state = "hidden";
                checkbox.dataset.state = "hidden";
                filterJobs(jobs);
            }
        })
    })
}

// fonction permettant de croiser les filtres des jobs
function filterJobs(jobs) {
    
    const backend = document.querySelector('.backend');
    const fullstack = document.querySelector('.fullstack');
    const frontend = document.querySelector('.frontend');
    const manager = document.querySelector('.manager');

    const cdd = document.querySelector('.cdd');
    const cdi = document.querySelector('.cdi');
    const stage = document.querySelector('.stage');
    const alternance = document.querySelector('.alternance');

    const partiel = document.querySelector('.partiel');
    const ponctuel = document.querySelector('.ponctuel');
    const total = document.querySelector('.total');
    const nonSpecifie = document.querySelector('.non-specifie');

    let itemsList = [backend, fullstack, frontend, manager, cdd, cdi, stage, alternance, partiel, ponctuel, total, nonSpecifie];

    function filterJobs2(jobs, itemsList) {
        let array = [];
        itemsList.forEach(item => {
            let property = "";
            let value = "";
          
            switch(item.classList[0]) {
                case "partiel":
                    property = "remoteWork";
                    value = "regularly"
                    break;
                case "ponctuel":
                    property = "remoteWork";
                    value = "eventually"
                    break;
                case "total":
                    property = "remoteWork";
                    value = "full"
                    break;
                case "non-specifie":
                    property = "remoteWork";
                    value = "none"
                    break;
                case "cdd":
                case "cdi":
                case "stage":
                case "alternance":
                    property = "contractType";
                    value = item.classList[0]
                    break;
                case "fullstack":
                case "frontend":
                case "backend":
                case "manager":
                    property = "jobTitle";
                    value = item.classList[0]
                    break;
            }

            if(item.dataset.check === "checked") {
                array.push({
                    item: item,
                    property: property,
                    value: value
                });
            }
        })
        let filters = {};

        let valueArr = array.map(function(item){ return item.propery });
        let isDuplicate = valueArr.some(function(item, idx){ 
    return valueArr.indexOf(item) != idx 
});


let occurrenceCriteria = 0;

        array.forEach((criteria, index) => {
            

            if(index > 0) {
                let propertyBefore;
                let indexUnderscore;
                if(array[index - 1].property.includes("_")) {
        
                    indexUnderscore = array[index - 1].property.indexOf("_");
                    
                    propertyBefore = array[index - 1].property.slice(0, indexUnderscore);
              
                if(criteria.property === propertyBefore) {
                    criteria.property = criteria.property.concat(`_${index}`)
  
                    occurrenceCriteria++;
                  
                }
                filters[criteria.property] = criteria.value;
            } else {
                if(criteria.property === array[index - 1].property) {
                    occurrenceCriteria++;
                    criteria.property = criteria.property.concat(`_${index}`)

                    filters[criteria.property] = criteria.value;
                } else {
                    filters[criteria.property] = criteria.value;
                }
            }
               
            } else {
                filters[criteria.property] = criteria.value;
            }
        })

 
 

          let valueOccurenciesJobTitle = [];
          let valueOccurenciesContractType = [];
          let valueOccurenciesRemoteWork = [];

          let indexUnderscore;

          for (let key in filters) {
            if(key.includes("_")) {
                let oldKey = key;
                indexUnderscore = key.indexOf("_");
                key = key.slice(0, indexUnderscore);
              if(key === "jobTitle") {
                valueOccurenciesJobTitle.push({jobTitle: filters[oldKey]});
              }
              if(key === "contractType") {
                valueOccurenciesContractType.push({contractType: filters[oldKey]});
              }
              if(key === "remoteWork") {
                valueOccurenciesRemoteWork.push({remoteWork: filters[oldKey]});
              }
            } else {
                if(key === "jobTitle") {
                    valueOccurenciesJobTitle.push({jobTitle: filters[key]});
                }
                if(key === "contractType") {

                    valueOccurenciesContractType.push({contractType: filters[key]});
                }
                if(key === "remoteWork") {
                    valueOccurenciesRemoteWork.push({remoteWork: filters[key]});
                }
            }
        }


  let lengthJobTitle = valueOccurenciesJobTitle.length;
  let lengthContractType = valueOccurenciesContractType.length;
  let lengthRemoteWork = valueOccurenciesRemoteWork.length;


  

  let newJobsJT = [];
  let newJobsCT = [];
  let newJobsRW = [];

  if(lengthJobTitle > 1) {
    if(lengthContractType === 1) {
 
        jobs = jobs.filter(job => job.contractType === valueOccurenciesContractType[0].contractType)
    }
    if(lengthContractType === 2) {
 
        jobs = jobs.filter(job => job.contractType === valueOccurenciesContractType[0].contractType || job.contractType === valueOccurenciesContractType[1].contractType)
    }
    if(lengthContractType === 3) {
 
        jobs = jobs.filter(job => job.contractType === valueOccurenciesContractType[0].contractType || job.contractType === valueOccurenciesContractType[1].contractType || job.contractType === valueOccurenciesContractType[2].contractType)
    }
    if(lengthContractType === 4) {
 
        jobs = jobs.filter(job => job.contractType === valueOccurenciesContractType[0].contractType || job.contractType === valueOccurenciesContractType[1].contractType || job.contractType === valueOccurenciesContractType[2].contractType || job.contractType === valueOccurenciesContractType[3].contractType)
    }

    if(lengthRemoteWork === 1) {

        jobs = jobs.filter(job => job.remoteWork === valueOccurenciesRemoteWork[0].remoteWork)
    }
    if(lengthRemoteWork === 2) {

        jobs = jobs.filter(job => job.remoteWork === valueOccurenciesRemoteWork[0].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[1].remoteWork)
    }
    if(lengthRemoteWork === 3) {

        jobs = jobs.filter(job => job.remoteWork === valueOccurenciesRemoteWork[0].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[1].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[2].remoteWork)
    }
    if(lengthRemoteWork === 4) {

        jobs = jobs.filter(job => job.remoteWork === valueOccurenciesRemoteWork[0].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[1].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[2].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[3].remoteWork)
    }

  } 

  if(lengthContractType > 1) {
    if(lengthJobTitle === 1) {
 
        jobs = jobs.filter(job => job.jobTitle === valueOccurenciesJobTitle[0].jobTitle)
    }
    if(lengthJobTitle === 2) {
 
        jobs = jobs.filter(job => job.jobTitle === valueOccurenciesJobTitle[0].jobTitle || job.jobTitle === valueOccurenciesJobTitle[1].jobTitle)
    }
    if(lengthJobTitle === 3) {
 
        jobs = jobs.filter(job => job.jobTitle === valueOccurenciesJobTitle[0].jobTitle || job.jobTitle === valueOccurenciesJobTitle[1].jobTitle || job.jobTitle === valueOccurenciesJobTitle[2].jobTitle)
    }
    if(lengthJobTitle === 4) {
 
        jobs = jobs.filter(job => job.jobTitle === valueOccurenciesJobTitle[0].jobTitle || job.jobTitle === valueOccurenciesJobTitle[1].jobTitle || job.jobTitle === valueOccurenciesJobTitle[2].jobTitle || job.jobTitle === valueOccurenciesJobTitle[3].jobTitle)
    }

    if(lengthRemoteWork === 1) {

        jobs = jobs.filter(job => job.remoteWork === valueOccurenciesRemoteWork[0].remoteWork)
    }
    if(lengthRemoteWork === 2) {

        jobs = jobs.filter(job => job.remoteWork === valueOccurenciesRemoteWork[0].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[1].remoteWork)
    }
    if(lengthRemoteWork === 3) {

        jobs = jobs.filter(job => job.remoteWork === valueOccurenciesRemoteWork[0].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[1].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[2].remoteWork)
    }
    if(lengthRemoteWork === 4) {

        jobs = jobs.filter(job => job.remoteWork === valueOccurenciesRemoteWork[0].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[1].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[2].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[3].remoteWork)
    }
  } 

  if(lengthRemoteWork > 1) {
    if(lengthJobTitle === 1) {
 
        jobs = jobs.filter(job => job.jobTitle === valueOccurenciesJobTitle[0].jobTitle)
    }

    if(lengthJobTitle === 2) {
 
        jobs = jobs.filter(job => job.jobTitle === valueOccurenciesJobTitle[0].jobTitle || job.jobTitle === valueOccurenciesJobTitle[1].jobTitle)
    }
    if(lengthJobTitle === 3) {
 
        jobs = jobs.filter(job => job.jobTitle === valueOccurenciesJobTitle[0].jobTitle || job.jobTitle === valueOccurenciesJobTitle[1].jobTitle || job.jobTitle === valueOccurenciesJobTitle[2].jobTitle)
    }
    if(lengthJobTitle === 4) {
 
        jobs = jobs.filter(job => job.jobTitle === valueOccurenciesJobTitle[0].jobTitle || job.jobTitle === valueOccurenciesJobTitle[1].jobTitle || job.jobTitle === valueOccurenciesJobTitle[2].jobTitle || job.jobTitle === valueOccurenciesJobTitle[3].jobTitle)
    }

    if(lengthContractType === 1) {

        jobs = jobs.filter(job => job.contractType === valueOccurenciesContractType[0].contractType)
    }

    if(lengthContractType === 2) {
 
        jobs = jobs.filter(job => job.contractType === valueOccurenciesContractType[0].contractType || job.contractType === valueOccurenciesContractType[1].contractType)
    }
    if(lengthContractType === 3) {
 
        jobs = jobs.filter(job => job.contractType === valueOccurenciesContractType[0].contractType || job.contractType === valueOccurenciesContractType[1].contractType || job.contractType === valueOccurenciesContractType[2].contractType)
    }
    if(lengthContractType === 4) {
 
        jobs = jobs.filter(job => job.contractType === valueOccurenciesContractType[0].contractType || job.contractType === valueOccurenciesContractType[1].contractType || job.contractType === valueOccurenciesContractType[2].contractType || job.contractType === valueOccurenciesContractType[3].contractType)
    }
  } 




    if(lengthJobTitle === 2) {

            newJobsJT = jobs.filter(job => job.jobTitle === valueOccurenciesJobTitle[0].jobTitle || job.jobTitle === valueOccurenciesJobTitle[1].jobTitle)    
    
}
    if(lengthJobTitle === 3) {

            newJobsJT = jobs.filter(job => job.jobTitle === valueOccurenciesJobTitle[0].jobTitle || job.jobTitle === valueOccurenciesJobTitle[1].jobTitle || job.jobTitle === valueOccurenciesJobTitle[2].jobTitle)    
      
}
    if(lengthJobTitle === 4) {

            newJobsJT = jobs.filter(job => job.jobTitle === valueOccurenciesJobTitle[0].jobTitle || job.jobTitle === valueOccurenciesJobTitle[1].jobTitle || job.jobTitle === valueOccurenciesJobTitle[2].jobTitle || job.jobTitle === valueOccurenciesJobTitle[3].jobTitle)    
}

if(lengthContractType === 2) {

    newJobsCT = jobs.filter(job => job.contractType === valueOccurenciesContractType[0].contractType || job.contractType === valueOccurenciesContractType[1].contractType)    

}
if(lengthContractType === 3) {

    newJobsCT = jobs.filter(job => job.contractType === valueOccurenciesContractType[0].contractType || job.contractType === valueOccurenciesContractType[1].contractType || job.contractType === valueOccurenciesContractType[2].contractType)    

}
if(lengthContractType === 4) {

    newJobsCT = jobs.filter(job => job.contractType === valueOccurenciesContractType[0].contractType || job.contractType === valueOccurenciesContractType[1].contractType || job.contractType === valueOccurenciesContractType[2].contractType || job.contractType === valueOccurenciesContractType[3].contractType)    

}



if(lengthRemoteWork === 2) {

    newJobsRW = jobs.filter(job => job.remoteWork === valueOccurenciesRemoteWork[0].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[1].remoteWork)    

}

if(lengthRemoteWork === 3) {

    newJobsRW = jobs.filter(job => job.remoteWork === valueOccurenciesRemoteWork[0].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[1].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[2].remoteWork)    

}

if(lengthRemoteWork === 4) {

    newJobsRW = jobs.filter(job => job.remoteWork === valueOccurenciesRemoteWork[0].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[1].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[2].remoteWork || job.remoteWork === valueOccurenciesRemoteWork[3].remoteWork)    

}


if((lengthJobTitle === null || lengthJobTitle < 2) && (lengthContractType === null || lengthContractType < 2) && (lengthRemoteWork === null || lengthRemoteWork < 2)) {

    jobs = jobs.filter(function(job) {
        let indexUnderscore;
        for (let key in filters) {
            if(key.includes("_")) {
                indexUnderscore = key.indexOf("_");
                key = key.slice(0, indexUnderscore);
            }
            
          if (job[key] === undefined || job[key] != filters[key])
            return false;
        }
        return true;
      });
}

if(newJobsJT.length > 0 && !(newJobsCT.length > 0) && !(newJobsRW.length > 0)) {
   return newJobsJT;
} 

if(newJobsJT.length > 0 && newJobsCT.length > 0 && !(newJobsRW.length > 0)) {
    return jobs;
}

if(newJobsJT.length > 0 && newJobsCT.length > 0 && newJobsRW.length > 0) {
    return jobs;
}

if(!(newJobsJT.length > 0) && newJobsCT.length > 0 && newJobsRW.length > 0) {
    return jobs;
}

if(!(newJobsJT.length > 0) && newJobsCT.length > 0 && !(newJobsRW.length > 0)) {
    return newJobsCT;
}

if(!(newJobsJT.length > 0) && !(newJobsCT.length > 0) && newJobsRW.length > 0) {
    return newJobsRW;
}

if(newJobsJT.length > 0 && !(newJobsCT.length > 0) && newJobsRW.length > 0) {
    return jobs;
}

    return jobs;

}
  

jobs =  filterJobs2(jobs, itemsList);

updateSortBy(jobs)

}



/* TRI DES OFFRES PAR DATE / SALAIRE */

function setSortByPickerList(jobs) {

    const sortByPicker = document.querySelector('.active-sort-by');
    const listSortBy = document.querySelector('.list-sort-by');
    sortByPicker.addEventListener('click', () => {
        const dataActive = sortByPicker.dataset.active;

        if(listSortBy.dataset.state === "hidden") {
            listSortBy.dataset.state = "visible";
        } else {
            listSortBy.dataset.state = "hidden";
        }

        const listItems = listSortBy.querySelectorAll('li');
        listItems.forEach(item => {
            if(item.dataset.list === dataActive) {
                item.classList.add('active-list-color');
            } else {
                item.classList.remove('active-list-color');
            }
        })

    })

    let dataActive = sortByPicker.dataset.active;
    const dateItem = document.querySelector('.by-date');

    dateItem.addEventListener('click', () => {
        if(dataActive !== "date") {
            dataActive = sortByPicker.dataset.active = "date";
            sortByPicker.querySelector("span").innerText = "Date";
            listSortBy.dataset.state = "hidden";
    
        }

        filterJobs(jobs);
   
    })

    const salaryItem = document.querySelector('.by-salary');

    salaryItem.addEventListener('click', () => {
 
        if(dataActive !== "salaire") {
            dataActive = sortByPicker.dataset.active = "salaire";
            sortByPicker.querySelector("span").innerText = "Salaire";
            listSortBy.dataset.state = "hidden";
        }

        filterJobs(jobs)
    })
    
}

// Fonction qui permet de définir le titre du job (eg. Dev Fullstack) en fonction de la donnée associée (fullstack)
function findCorrespondingJobLabel(jobTitleData) {
    let label = "";

    switch(jobTitleData) {
        case "fullstack":
            label = "Dev Fullstack";
            break;
        case "manager":
            label = "Projet / Product Management";
            break;
        case "frontend":
            label = "Dev Frontend";
            break;
        case "backend":
            label = "Dev Backend";
            break;
        default:
            label = "";
            break;
        
    }

    return label;

}

// Fonction qui permet de définir le type de télétravail (eg. Télétravail partiel) en fonction de la donnée associée (regularly)
function findCorrespondingRemoteLabel(remoteWorkData) {
    let labelAndClass = {
        label: null,
        class: null
    };

    switch(remoteWorkData) {
        case "regularly":
            labelAndClass = {
                label: "Télétravail partiel",
                class: "partiel-color"
            };
            break;
        case "eventually":
            labelAndClass = {
                label: "Télétravail ponctuel",
                class: "ponctuel-color"
            };
            break;
        case "full":
            labelAndClass = {
                label: "Télétravail total",
                class: "total-color"
            };
            break;
        default:
            labelAndClass = {
                label: null,
                class: null
            };
            break;
        
    }

    return labelAndClass;

}

// Fonction qui permet de définir le type de contrat (eg. Dev Fullstack) en fonction de la donnée associée (fullstack)
function findCorrespondingContractLabel(dataContract) {
    let label = "";

    if(dataContract.length <= 3) {
        label = dataContract.toUpperCase();
    } else {
        label = dataContract.charAt(0).toUpperCase() + dataContract.slice(1);
    }

    return label;

}

// Fonction qui permet de transformer une date en "Days ago" ou "Months ago" ou "Years ago"
function changeDateInDaysOrMonthsOrYearsAgo(publishDate) {
    let daysOrMonthsOrYearsAgo = "";

    let dateWithoutHours = publishDate.slice(0,10);
    let yearPublishDate = dateWithoutHours.slice(0, 4);

    let dateNow = new Date().toISOString().split('T')[0];
    let yearNow = dateNow.slice(0, 4);

    // si date de publication est la même année que l'année actuelle
    if(yearNow - yearPublishDate === 0) {
        
        let monthPublishDate = dateWithoutHours.slice(5, 7);
        let monthNow = dateNow.slice(5, 7);

        // si date de publication est aussi le même mois que le mois actuel
        if(monthNow - monthPublishDate === 0) {

            let dayPublishDate = dateWithoutHours.slice(8, 10);
            let dayNow = dateNow.slice(8, 10);

            // si date de publication est aussi même jour qu'aujourd'hui
            if(dayNow - dayPublishDate === 0) {
                daysOrMonthsOrYearsAgo = "Aujourd'hui";
            } else {

                let singOuPlurJour = "";

                if(dayNow - dayPublishDate === 1) {
                    singOuPlurJour = "jour"
                } else {
                    singOuPlurJour = "jours";
                }

                daysOrMonthsOrYearsAgo = `Il y a ${dayNow - dayPublishDate} ${singOuPlurJour}`;
            }
            

        } else {
            daysOrMonthsOrYearsAgo = `Il y a ${monthNow - monthPublishDate} mois`;
        }

    } else { 

        let singOuPlurAnnee = "";
        if(yearNow - yearPublishDate === 1) {
            singOuPlurAnnee = "an"
        } else {
            singOuPlurAnnee = "ans";
        }

        daysOrMonthsOrYearsAgo = `Il y a ${yearNow - yearPublishDate} ${singOuPlurAnnee}`;
    }

    return daysOrMonthsOrYearsAgo;

}

// Fonction qui permet de passer du format date "2022-05-10T11:00:36" au format "10 mai 2022" (en FR)
function changeFormatStartDate(startDateData) {
    let newStartDate = "";

    let dateWithoutHours = startDateData.slice(0,10);

    let startYear = dateWithoutHours.slice(0, 4);
    let startMonth = "";
    switch(dateWithoutHours.slice(5,7)) {
        case "01":
            startMonth = "janvier";
            break;
        case "02":
            startMonth = "février";
            break;
        case "03":
            startMonth = "mars";
            break;
        case "04":
            startMonth = "avril";
            break;
        case "05":
            startMonth = "mai";
            break;
        case "06":
            startMonth = "juin";
            break;
        case "07":
            startMonth = "juillet";
            break;
        case "08":
            startMonth = "août";
            break;
        case "09":
            startMonth = "septembre";
            break;
        case "10":
            startMonth = "octobre";
            break;
        case "11":
            startMonth = "novembre";
            break;
        case "12":
            startMonth = "décembre";
            break;
        default:
            startMonth = "";
            break;
    }

    let startDay = dateWithoutHours.slice(8, 10);


    return newStartDate = `${startDay} ${startMonth} ${startYear}`;
}

// Fonction permettant de visualiser les détails de chaque job (modification du style en fonction du data-state des éléments à modifier)
const seeDetails = () => {
    const jobCards = document.querySelectorAll('.job-container');

    jobCards.forEach(jobCard => {
        let jobDetails = jobCard.querySelector('.job-details');
        let subtitles = jobCard.querySelectorAll('.subtitle');
        let salaryContainer = jobCard.querySelector('.salary-container').outerHTML;
        let otherInfosSubtitles = jobCard.querySelector('.job-subtitle-container');
        let firstOtherInfosSubtitles = jobCard.querySelector('.job-subtitle-container').innerHTML;

        const reduireContainer = document.createElement('div');
        reduireContainer.classList.add('reduire-container');
        reduireContainer.innerHTML = "<p class='reduire'>Réduire</p> <div class='minus-container'><span class='minus'></span></div>";
        reduireContainer.dataset.state = "hidden";
        jobCard.appendChild(reduireContainer);

        jobCard.addEventListener('click', () => {
    
            if(!jobDetails.dataset.state || jobDetails.dataset.state !== "open") {
                jobDetails.dataset.state = "open";
                jobCard.dataset.state = "open";
                subtitles.forEach(subtitle => {
                    subtitle.dataset.state = "hidden";
                })

                setTimeout(() => {
                    let newSalaryElement = otherInfosSubtitles.innerHTML = `${salaryContainer}`;
                    
                    otherInfosSubtitles.dataset.state = "visible";
                    reduireContainer.dataset.state = "visible";
                }, 180)

            } else {
                otherInfosSubtitles.dataset.state = "hidden";


                setTimeout(() => {
                    otherInfosSubtitles.innerHTML = `${firstOtherInfosSubtitles}`;
                    jobDetails.dataset.state = "hidden";
                    jobCard.dataset.state = "hidden";
                    subtitles.forEach(subtitle => {
                        subtitle.dataset.state = "visible";
                    })     
                    reduireContainer.dataset.state = "hidden";
                }, 180)
              
            }
        })
    })
}


/* print current page */

const printBtn = document.querySelector('.print-btn');

printBtn.addEventListener('click', () => {
    window.print();
})

/* close list(s) when clicking outside of list(s) */

const filterBtns = document.querySelectorAll(".filter-btn");
const filterList = document.querySelectorAll('.filter-list');
const sortByBtn = document.querySelector('.active-sort-by');
const listSortBy = document.querySelector('.list-sort-by');

filterBtns.forEach((filterBtn, index) => {
    document.addEventListener("click", (event) => {

        if (!filterBtn.contains(event.target)) {
         filterList[index].dataset.state = "hidden";
        }

      });
})

document.addEventListener("click", (event) => {
  if(!sortByBtn.contains(event.target)) {
    listSortBy.dataset.state = "hidden";
  }
});

