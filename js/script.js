// Déclaration de la fonction asynchrone qui permettra, une fois appelée, de récupérer les données des différents jobs
async function loadJobs() {
    const response = await fetch('data.json');
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
        sortBy(jobs);

   
         /* vérification du tri par défaut - quand on arrive sur la page - (date ou salaire) */
         const sortByPicker = document.querySelector('.active-sort-by');
         /* ordre par DATE */
         if(sortByPicker.dataset.active === "salaire") {
           jobs.sort((a, b) => b.salary - a.salary);
         } else if(sortByPicker.dataset.active === "date") {
           jobs.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
         }
        
        const tenJobs = jobs.slice(0, 20);
       /*  console.log(tenJobs);
 */
        tenJobs.forEach(job => {

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

        viewDetails();
       
    }


}

// Appel de la fonction loadJobs()
loadJobs();


function displaySortBy(jobs) {

    let jobContent = "";
    const tenJobs = jobs.slice(0, 20);
    /*  console.log(tenJobs);
*/
     tenJobs.forEach(job => {

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

     viewDetails();
}

function updateSortBy(jobs, sortByDataSet1, sortByDataSet2) {
    /* console.log(jobs) */
    const sortByPicker = document.querySelector('.active-sort-by');
    /* ordre par DATE */
    if(sortByPicker.dataset.active === sortByDataSet1) {
      jobs.sort((a, b) => b.salary - a.salary);
    } else if(sortByPicker.dataset.active === sortByDataSet2) {
      jobs.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    }

    displaySortBy(jobs);
}


// Fonction qui permet de filtrer selon le titre du poste
function posteFilter(jobs) {
    const postePicker = document.querySelector('.poste-btn');
    const listJobTitle = document.querySelector('.list-job-title');
    postePicker.addEventListener('click', () => {
        if(listJobTitle.dataset.state === "hidden") {
            listJobTitle.dataset.state = "visible";
        } else {
            listJobTitle.dataset.state = "hidden";
        }
    })

    const itemsJobTitle = listJobTitle.querySelectorAll('li');
    itemsJobTitle.forEach(item => {
        item.addEventListener('click', () => {

            let checkedIcon = item.querySelector('img');
            let checkbox = item.querySelector('.checkbox');

            if(item.dataset.check !== "checked") {
                item.dataset.check = "checked";
                checkedIcon.dataset.state = "visible";
                checkbox.dataset.state = "visible";
                updatePosteFilter(jobs);
            } else {
                item.dataset.check = "unchecked";
                checkedIcon.dataset.state = "hidden";
                checkbox.dataset.state = "hidden";
                updatePosteFilter(jobs);
            }
        })
    })
}
// fonction permettant de filtrer tous les jobs en même temps
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
    // refactoring in progress
    let itemsList = [backend, fullstack, frontend, manager, cdd, cdi, stage, alternance, partiel, ponctuel, total, nonSpecifie];

    function filterJobs2(jobs, arrayItemsChecked) {
        let array = [];
        arrayItemsChecked.forEach(item => {
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

 
  /*       console.log(array);  */
        let numberItemsChecked = array.length;
        let filteredJobs = [];
        array.forEach(item => {
           /*  console.log(item.property) */
            if(array.length === 1) {
                filteredJobs = jobs.filter(job => job[item.property] === item.value)
               /*  console.log(filteredJobs); */
            }
        })
        jobs = filteredJobs;
        return jobs;
         /*    jobs.filter(function(job) {
                return job
            }) */
            /* jobs.filter(job => job[item.property] === item.value) */
    
    }

    jobs = filterJobs2(jobs, itemsList);

/*     let jobsBackend = [];
    let jobsFullstack  = [];
    let jobsFrontend  = [];
    let jobsManager  = []; */

    /* POSTE CONDITIONS */

    /* Backend sélectionné */
/*     if(partiel.dataset.check === "checked" && ponctuel.dataset.check === "unchecked" && total.dataset.check === "unchecked" && nonSpecifie.dataset.check === "unchecked") {
 
        jobsBackend = jobsBackend.filter(job => job.remoteWork === "regularly")
        console.log(jobsBackend)   
    } else if(partiel.dataset.check === "checked" && ponctuel.dataset.check === "checked" && total.dataset.check === "unchecked" && nonSpecifie.dataset.check === "unchecked") {

        jobsBackend = jobsBackend.filter(job => job.remoteWork === "regularly" || job.remoteWork === "eventually")
        console.log(jobsBackend)   
    } else if(partiel.dataset.check === "checked" && ponctuel.dataset.check === "checked" && total.dataset.check === "unchecked" && nonSpecifie.dataset.check === "unchecked") {

        jobsBackend = jobsBackend.filter(job => job.remoteWork === "regularly" || job.remoteWork === "eventually")
        console.log(jobsBackend)   
    } */

    // conditions qui vérifie si d'autres cases "Contrat" sont sélectionnés avec Backend
  /*   if(backend.dataset.check === "checked" && cdd.dataset.check === "unchecked" && cdi.dataset.check === "unchecked" && stage.dataset.check === "unchecked" && alternance.dataset.check === "unchecked" && partiel.dataset.check === "unchecked" && ponctuel.dataset.check === "unchecked" && total.dataset.check === "unchecked" && nonSpecifie.dataset.check === "unchecked") {
        jobsBackend = jobs.filter(job => job.jobTitle === "backend");
    } else if(backend.dataset.check === "checked" && cdd.dataset.check === "unchecked" && cdi.dataset.check === "unchecked" && stage.dataset.check === "unchecked" && alternance.dataset.check === "unchecked" && partiel.dataset.check === "checked" && ponctuel.dataset.check === "unchecked" && total.dataset.check === "unchecked" && nonSpecifie.dataset.check === "unchecked") {
        
    }
    
    
    if(backend.dataset.check === "checked" && cdd.dataset.check === "checked" && cdi.dataset.check === "unchecked" && stage.dataset.check === "unchecked" && alternance.dataset.check === "unchecked") {
        jobsBackend = jobs.filter(job => job.jobTitle === "backend" && job.contractType === "cdd");
    } else if(backend.dataset.check === "checked" && cdd.dataset.check === "checked" && cdi.dataset.check === "checked" && stage.dataset.check === "unchecked" && alternance.dataset.check === "unchecked") {
        jobsBackend = jobs.filter(job => job.jobTitle === "backend" && (job.contractType === "cdd" || job.contractType === "cdi"));
    } else if(backend.dataset.check === "checked" && cdd.dataset.check === "checked" && cdi.dataset.check === "checked" && stage.dataset.check === "checked" && alternance.dataset.check === "unchecked") {
        jobsBackend = jobs.filter(job => job.jobTitle === "backend" && (job.contractType === "cdd" || job.contractType === "cdi" || job.contractType === "stage"));
    } else if(backend.dataset.check === "checked" && cdd.dataset.check === "checked" && cdi.dataset.check === "checked" && stage.dataset.check === "checked" && alternance.dataset.check === "checked") {
        jobsBackend = jobs.filter(job => job.jobTitle === "backend" && (job.contractType === "cdd" || job.contractType === "cdi" || job.contractType === "stage" || job.contractType === "alternance"));
        console.log(jobsBackend)
    } 



    if(fullstack.dataset.check === "checked") {
        jobsFullstack = jobs.filter(job => job.jobTitle === "fullstack");
    }

    if(frontend.dataset.check === "checked") {
        jobsFrontend = jobs.filter(job => job.jobTitle === "frontend");
    }

    if(manager.dataset.check === "checked") {
        jobsManager = jobs.filter(job => job.jobTitle === "manager");
    }


    if(backend.dataset.check === "unchecked" && fullstack.dataset.check === "unchecked" && frontend.dataset.check === "unchecked" && manager.dataset.check === "unchecked") {
      
    } else {
        jobs = jobsBackend.concat(jobsFullstack, jobsFrontend, jobsManager); 
    } */

    updateSortBy(jobs, "salaire", "date")
}

function updatePosteFilter(jobs) {
    const backend = document.querySelector('.backend');
    const fullstack = document.querySelector('.fullstack');
    const frontend = document.querySelector('.frontend');
    const manager = document.querySelector('.manager');

    let jobsBackend = [];
    let jobsFullstack  = [];
    let jobsFrontend  = [];
    let jobsManager  = [];

    if(backend.dataset.check === "checked") {
        jobsBackend = jobs.filter(job => job.jobTitle === "backend");
    }

    if(fullstack.dataset.check === "checked") {
        jobsFullstack = jobs.filter(job => job.jobTitle === "fullstack");
    }

    if(frontend.dataset.check === "checked") {
        jobsFrontend = jobs.filter(job => job.jobTitle === "frontend");
    }

    if(manager.dataset.check === "checked") {
        jobsManager = jobs.filter(job => job.jobTitle === "manager");
    }


    if(backend.dataset.check === "unchecked" && fullstack.dataset.check === "unchecked" && frontend.dataset.check === "unchecked" && manager.dataset.check === "unchecked") {
      
    } else {
        jobs = jobsBackend.concat(jobsFullstack, jobsFrontend, jobsManager); 
    }
/* 
    console.log(jobs) */
    updateSortBy(jobs, "salaire", "date")
}

// Fonction qui permet de filtrer selon le titre du poste
function contractFilter(jobs) {
    const contractPicker = document.querySelector('.contract-btn');
    const listContract = document.querySelector('.list-contract');
    contractPicker.addEventListener('click', () => {
        if(listContract.dataset.state === "hidden") {
            listContract.dataset.state = "visible";
        } else {
            listContract.dataset.state = "hidden";
        }
    })

    const itemsContract = listContract.querySelectorAll('li');
    itemsContract.forEach(item => {
        item.addEventListener('click', () => {

            let checkedIcon = item.querySelector('img');
            let checkbox = item.querySelector('.checkbox');

            if(item.dataset.check !== "checked") {
                item.dataset.check = "checked";
                checkedIcon.dataset.state = "visible";
                checkbox.dataset.state = "visible";
                updateContractFilter(jobs);
            } else {
                item.dataset.check = "unchecked";
                checkedIcon.dataset.state = "hidden";
                checkbox.dataset.state = "hidden";
                updateContractFilter(jobs);
            }
        })
    })
}

function updateContractFilter(jobs) {

    const cdd = document.querySelector('.cdd');
    const cdi = document.querySelector('.cdi');
    const stage = document.querySelector('.stage');
    const alternance = document.querySelector('.alternance');

    let jobsCDD = [];
    let jobsCDI  = [];
    let jobsStage  = [];
    let jobsAlternance  = [];

    if(cdd.dataset.check === "checked") {
        jobsCDD = jobs.filter(job => job.contractType === "cdd");
    }

    if(cdi.dataset.check === "checked") {
        jobsCDI = jobs.filter(job => job.contractType === "cdi");
    }

    if(stage.dataset.check === "checked") {
        jobsStage = jobs.filter(job => job.contractType === "stage");
    }

    if(alternance.dataset.check === "checked") {
        jobsAlternance = jobs.filter(job => job.contractType === "alternance");
    }


    if(cdd.dataset.check === "unchecked" && cdi.dataset.check === "unchecked" && stage.dataset.check === "unchecked" && alternance.dataset.check === "unchecked") {
      
    } else {
        jobs = jobsCDD.concat(jobsCDI, jobsStage, jobsAlternance); 
    }

    updateSortBy(jobs, "salaire", "date")
}

// Fonction qui permet de filtrer selon le type de télétravail
function remoteFilter(jobs) {
    const remotePicker = document.querySelector('.remote-btn');
    const listRemote = document.querySelector('.list-remote');
    remotePicker.addEventListener('click', () => {
        if(listRemote.dataset.state === "hidden") {
            listRemote.dataset.state = "visible";
        } else {
            listRemote.dataset.state = "hidden";
        }
    })

    const itemsRemote = listRemote.querySelectorAll('li');
    itemsRemote.forEach(item => {
        item.addEventListener('click', () => {

            let checkedIcon = item.querySelector('img');
            let checkbox = item.querySelector('.checkbox');

            if(item.dataset.check !== "checked") {
                item.dataset.check = "checked";
                checkedIcon.dataset.state = "visible";
                checkbox.dataset.state = "visible";
               updateRemoteFilter(jobs);
            } else {
                item.dataset.check = "unchecked";
                checkedIcon.dataset.state = "hidden";
                checkbox.dataset.state = "hidden";
                updateRemoteFilter(jobs);
            }
        })
    })
}

function updateRemoteFilter(jobs) {

    const partiel = document.querySelector('.partiel');
    const ponctuel = document.querySelector('.ponctuel');
    const total = document.querySelector('.total');
    const nonSpecifie = document.querySelector('.non-specifie');

    let jobsPartiel = [];
    let jobsPonctuel  = [];
    let jobsTotal  = [];
    let jobsNonSpecifie  = [];

    if(partiel.dataset.check === "checked") {
        jobsPartiel = jobs.filter(job => job.remoteWork === "regularly");
    }

    if(ponctuel.dataset.check === "checked") {
        jobsPonctuel = jobs.filter(job => job.remoteWork === "eventually");
    }

    if(total.dataset.check === "checked") {
        jobsTotal = jobs.filter(job => job.remoteWork === "full");
    }

    if(nonSpecifie.dataset.check === "checked") {
        jobsNonSpecifie = jobs.filter(job => job.remoteWork === "unknown" || job.remoteWork === "none");
    }


    if(partiel.dataset.check === "unchecked" && ponctuel.dataset.check === "unchecked" && total.dataset.check === "unchecked" && nonSpecifie.dataset.check === "unchecked") {
      
    } else {
        jobs = jobsPartiel.concat(jobsPonctuel, jobsTotal, jobsNonSpecifie); 
    }

    updateSortBy(jobs, "salaire", "date")
}

/* TRI DES OFFRES PAR DATE / SALAIRE */

function sortBy(jobs) {

    const sortByPicker = document.querySelector('.active-sort-by');
    const listSortBy = document.querySelector('.list-sort-by');
    sortByPicker.addEventListener('click', () => {
        const dataActive = sortByPicker.dataset.active;
      /*   console.log(listSortBy) */
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
            updateSortBy(jobs, "date", "salaire");    
            dataActive = sortByPicker.dataset.active = "date";
            sortByPicker.querySelector("span").innerText = "Date";
            listSortBy.dataset.state = "hidden";
    
        }
   
    })

    const salaryItem = document.querySelector('.by-salary');

    salaryItem.addEventListener('click', () => {
   /*      console.log("yes") */
        if(dataActive !== "salaire") {
            updateSortBy(jobs, "date", "salaire");
            dataActive = sortByPicker.dataset.active = "salaire";
            sortByPicker.querySelector("span").innerText = "Salaire";
            listSortBy.dataset.state = "hidden";
        }
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
const viewDetails = () => {
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