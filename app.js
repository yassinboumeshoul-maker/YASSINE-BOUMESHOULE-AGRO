document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const resultsPanel = document.getElementById('results-panel');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    
    // UI Elements for results
    const uiDuree = document.getElementById('res-duree');
    const uiDate = document.getElementById('res-date');
    const uiRisk = document.getElementById('res-risk');
    const uiExplication = document.getElementById('res-explication');
    


    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Setup Loading State
        btnText.classList.add('hidden');
        spinner.classList.remove('hidden');
        submitBtn.disabled = true;

        // Gather form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Handle checkboxes explicitly since unchecked ones don't appear in FormData
        const checkboxes = ['produit_ouvert', 'rupture_froid', 'conservateurs'];
        checkboxes.forEach(cb => {
            data[cb] = form.elements[cb].checked ? 'oui' : 'non';
        });

        try {
            // Simulation d'un délai de calcul court pour l'UX
            await new Promise(resolve => setTimeout(resolve, 600));

            // CALCUL LOCAL (ANCIENNEMENT BACKEND)
            const result = calculateShelfLifeLocally(data);
            
            // Update UI
            displayResults(result);
            
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la prédiction : " + error.message);
        } finally {
            // Restore button state
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    // --- LOGIQUE DE CALCUL SCIENTIFIQUE (PORTÉE DU BACKEND) ---
    const PRODUCTS_DATA = {
        'lait_pasteurise': { N0: 100, mu_table: { 4.0: 1.35, 15.0: 4.08 }, frozen_days: 90, source_mu: "ComBase: Pseudomonas fluorescens", source_frozen: "USDA FoodKeeper: 1-3 mois" },
        'lait_uht': { N0: 100, mu_table: { 4.0: 1.0 }, frozen_days: 90, source_mu: "ComBase: Contaminants psychrotrophes", source_frozen: "Standards industriels" },
        'yaourt': { N0: 100, mu_table: { 4.0: 0.3 }, frozen_days: 60, source_mu: "ComBase: Altération fongique", source_frozen: "USDA: 1-2 mois" },
        'fromage': { N0: 100, mu_table: { 8.0: 2.0 }, frozen_days: 180, source_mu: "ComBase: Listeria monocytogenes", source_frozen: "FDA/USDA: Jusqu'à 6 mois" },
        'viande': { N0: 100, mu_table: { 4.0: 1.2, 10.0: 3.0 }, frozen_days: 180, source_mu: "ComBase: Pseudomonas spp.", source_frozen: "FDA/USDA: ~6 mois" },
        'poisson': { N0: 100, mu_table: { 4.0: 1.8, 8.0: 3.5 }, frozen_days: 120, source_mu: "ComBase: Psychrotrophes marins", source_frozen: "USDA: ~4 mois" },
        'jus': { N0: 100, mu_table: { 4.0: 0.2, 10.0: 1.5 }, frozen_days: 365, source_mu: "ComBase: Levures", source_frozen: "USDA: 8-12 mois" },
        'conserve': { N0: 10, mu_table: { 20.0: 0.010 }, frozen_days: 365, source_mu: "ComBase: Clostridium sporogenes", source_frozen: "Standards: possible 1 an" },
        'autre': { N0: 100, mu_table: { 4.0: 1.0 }, frozen_days: 90, source_mu: "ComBase: Microflore totale", source_frozen: "Estimation prudente FDA" }
    };
    const N_LIMITE = 10000000;

    function interpolateMu(temp, mu_table) {
        const temps = Object.keys(mu_table).map(Number).sort((a, b) => a - b);
        if (temp <= temps[0]) return mu_table[temps[0]];
        if (temp >= temps[temps.length - 1]) return mu_table[temps[temps.length - 1]];

        for (let i = 0; i < temps.length - 1; i++) {
            const t1 = temps[i], t2 = temps[i + 1];
            if (temp >= t1 && temp <= t2) {
                const mu1 = mu_table[t1], mu2 = mu_table[t2];
                return mu1 + (temp - t1) * (mu2 - mu1) / (t2 - t1);
            }
        }
        return 0.01;
    }

    function calculateShelfLifeLocally(data) {
        const productType = data.produit || 'autre';
        const params = PRODUCTS_DATA[productType] || PRODUCTS_DATA['autre'];
        const temp = parseFloat(data.temperature) || 4.0;
        const prodDate = new Date(data.date_production);
        
        let finalDays = 0;
        let explanation = "--- ANALYSE SCIENTIFIQUE (FRONTEND) ---\n";

        if (temp < 0) {
            finalDays = params.frozen_days;
            explanation += `ÉTAT : PRODUIT CONGELÉ (${temp}°C)\n`;
            explanation += `LOGIQUE : Application des standards de stockage à long terme.\n`;
            explanation += `DURÉE TYPE : ${finalDays} jours.\n`;
            explanation += `SOURCE : ${params.source_frozen}\n\n`;
            explanation += "FACTEURS : Température négative bloquant la croissance pathogène.\n";
        } else {
            const mu = interpolateMu(temp, mu_table = params.mu_table);
            const t_initial = (Math.log(N_LIMITE) - Math.log(params.N0)) / mu;
            
            explanation += `ÉTAT : RÉFRIGÉRATION / AMBIANT (${temp}°C)\n`;
            explanation += `μmax : ${mu.toFixed(4)} jour⁻¹ (Source: ${params.source_mu})\n\n`;
            explanation += `FORMULE : t = (ln(Nlimite) − ln(N0)) / μmax\n`;
            explanation += `DURÉE INITIALE : ${t_initial.toFixed(1)} jours\n\n`;

            let multiplier = 1.0;
            let adjustments = [];
            if (data.produit_ouvert === 'oui') { multiplier -= 0.30; adjustments.push("Produit ouvert (-30%)"); }
            if (data.rupture_froid === 'oui') { multiplier -= 0.40; adjustments.push("Rupture chaîne froid (-40%)"); }
            if (data.conservateurs === 'oui') { multiplier += 0.10; adjustments.push("Conservateurs (+10%)"); }

            finalDays = Math.max(0, Math.round(t_initial * multiplier));

            if (adjustments.length > 0) {
                explanation += "FACTEURS CORRECTIFS :\n" + adjustments.map(a => `• ${a}`).join('\n') + "\n";
                explanation += `DURÉE FINALE : ${finalDays} jours.\n`;
            } else {
                explanation += "FACTEURS : Conditions optimales de stockage.\n";
            }
        }

        const estimatedDate = new Date(prodDate);
        estimatedDate.setDate(estimatedDate.getDate() + finalDays);
        const risk = finalDays > 5 ? "Vert" : (finalDays > 2 ? "Orange" : "Rouge");

        return {
            duree_restante_jours: finalDays,
            nouvelle_date_estimee: estimatedDate.toISOString().split('T')[0],
            niveau_risque: risk,
            explication_scientifique: explanation
        };
    }

    function displayResults(data) {
        // Show panel
        resultsPanel.classList.remove('hidden');
        
        // Scroll to results on mobile
        if(window.innerWidth < 900) {
            resultsPanel.scrollIntoView({ behavior: 'smooth' });
        }

        uiDuree.textContent = `${data.duree_restante_jours} Jours`;
        uiDate.textContent = data.nouvelle_date_estimee;
        
        uiRisk.textContent = data.niveau_risque;
        uiRisk.className = `kpi-value risk-badge risk-${data.niveau_risque}`;
        
        uiExplication.innerText = data.explication_scientifique;


    }



    // Dynamic Form adjustments
    const productSelect = document.getElementById('produit');
    productSelect.addEventListener('change', (e) => {
        const product = e.target.value;
        const phInput = document.getElementById('ph');

        // Set realistic defaults based on product selection
        const defaults = {
            'lait_uht': { ph: 6.7 },
            'lait_pasteurise': { ph: 6.7 },
            'jus': { ph: 3.5 },
            'yaourt': { ph: 4.5 },
            'viande': { ph: 6.8 },
            'poisson': { ph: 6.7 },
            'fromage': { ph: 6.5 },
            'conserve': { ph: 6.0 },
            'autre': { ph: 7.0 }
        };

        if (defaults[product]) {
            phInput.value = defaults[product].ph;
            
            // Highlight fields briefly to show they updated automatically
            phInput.style.backgroundColor = 'rgba(79, 70, 229, 0.4)';
            
            setTimeout(() => {
                phInput.style.backgroundColor = '';
            }, 500);
        }
    });

    // Default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date_production').value = today;
    
    // Weather integration
    const btnMeteo = document.getElementById('btn-meteo');
    const villeInput = document.getElementById('ville');
    const meteoMsg = document.getElementById('meteo-msg');
    const tempInput = document.getElementById('temperature');
    const humInput = document.getElementById('humidite');
    const meteoSpinner = btnMeteo.querySelector('.meteo-spinner');
    const meteoBtnText = btnMeteo.querySelector('.btn-text');

    btnMeteo.addEventListener('click', async () => {
        const ville = villeInput.value.trim();
        if (!ville) {
            meteoMsg.textContent = "Veuillez saisir une ville.";
            meteoMsg.style.color = "#f87171";
            return;
        }

        // UI Loading
        meteoMsg.textContent = "";
        meteoBtnText.style.display = 'none';
        meteoSpinner.style.display = 'inline-block';
        btnMeteo.disabled = true;

        try {
            // 1. Géocodage
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ville)}&count=1&language=fr&format=json`;
            const geoResp = await fetch(geoUrl);
            const geoData = await geoResp.json();
            
            if (!geoData.results || geoData.results.length === 0) {
                throw new Error(`Ville '${ville}' introuvable.`);
            }
            
            const location = geoData.results[0];
            const { latitude, longitude, name } = location;
            
            // 2. Météo
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=relative_humidity_2m`;
            const weatherResp = await fetch(weatherUrl);
            const weatherData = await weatherResp.json();
            
            const humidite = weatherData.current.relative_humidity_2m;

            // Populate field
            if (humidite !== undefined) humInput.value = humidite;

            // Show success
            meteoMsg.textContent = `Humidité récupérée pour ${name} : ${humidite}%.`;
            meteoMsg.style.color = "#4ade80"; // green
            
            // Visual feedback
            humInput.style.backgroundColor = 'rgba(74, 222, 128, 0.4)';
            setTimeout(() => {
                humInput.style.backgroundColor = '';
            }, 1000);

        } catch (err) {
            meteoMsg.textContent = err.message;
            meteoMsg.style.color = "#f87171";
        } finally {
            meteoBtnText.style.display = 'inline-block';
            meteoSpinner.style.display = 'none';
            btnMeteo.disabled = false;
        }
    });

});
