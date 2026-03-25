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
        'lait_pasteurise': { 
            micro: 'Pseudomonas spp. (psychrotrophes)',
            mu_opt: 11.0, b: 0.087, Tmin: -9, Tmax: 45, 
            pH_min: 4.5, pH_opt: 6.7, pH_max: 9.0, 
            aw_min: 0.94, aw_opt: 0.99, 
            N0: 1e3, Nlim: 1e7,
            source: "[17] ComBase / Pseudomonas fits"
        },
        'lait_uht': { 
            micro: 'Bacillus spp. / Pseudomonas (post-ouverture)',
            mu_opt: 11.0, b: 0.087, Tmin: -9, Tmax: 45, 
            pH_min: 4.5, pH_opt: 6.7, pH_max: 9.0, 
            aw_min: 0.94, aw_opt: 0.99, 
            N0: 1e3, Nlim: 1e7,
            source: "Stérilité commerciale; paramètres Pseudomonas si ouvert"
        },
        'yaourt': { 
            micro: 'Lactobacillus bulgaricus & Streptococcus thermophilus',
            mu_opt: 3.0, b: 0.04, Tmin: 0, Tmax: 45, 
            pH_min: 3.5, pH_opt: 5.0, pH_max: 6.5, 
            aw_min: 0.97, aw_opt: 0.99, 
            N0: 1e7, Nlim: 1e9,
            source: "Microbiologie du yaourt [23]"
        },
        'fromage': { 
            micro: 'Flore lactique & levures de surface',
            mu_opt: 2.0, b: 0.035, Tmin: 2, Tmax: 40, 
            pH_min: 4.0, pH_opt: 5.5, pH_max: 7.0, 
            aw_min: 0.90, aw_opt: 0.97, 
            N0: 1e5, Nlim: 1e9,
            source: "Review fromages à pâte molle"
        },
        'viande': { 
            micro: 'Pseudomonas spp. & Bactéries Lactiques',
            mu_opt: 6.0, b: 0.08, Tmin: -5, Tmax: 40, 
            pH_min: 4.5, pH_opt: 6.5, pH_max: 8.0, 
            aw_min: 0.97, aw_opt: 0.99, 
            N0: 1e3, Nlim: 1e7,
            source: "Frontiers 2020 Meat Microbiota"
        },
        'viande_hachee': { 
            micro: 'Pseudomonas, Enterobacteriaceae, LAB',
            mu_opt: 10.0, b: 0.1, Tmin: -2, Tmax: 40, 
            pH_min: 4.5, pH_opt: 6.5, pH_max: 8.5, 
            aw_min: 0.96, aw_opt: 0.99, 
            N0: 1e4, Nlim: 1e7,
            source: "Estimation forte charge microbienne"
        },
        'poisson': { 
            micro: 'Shewanella putrefaciens & Pseudomonas',
            mu_opt: 10.0, b: 0.12, Tmin: -2, Tmax: 35, 
            pH_min: 5.0, pH_opt: 6.5, pH_max: 8.0, 
            aw_min: 0.96, aw_opt: 0.99, 
            N0: 1e3, Nlim: 1e7,
            source: "Tuna spoilage study [28]"
        },
        'jus': { 
            micro: 'Levures acidophiles / Alicyclobacillus',
            mu_opt: 4.0, b: 0.05, Tmin: 0, Tmax: 40, 
            pH_min: 2.5, pH_opt: 4.0, pH_max: 6.0, 
            aw_min: 0.90, aw_opt: 0.98, 
            N0: 100, Nlim: 1e6,
            source: "USDA / Standards boissons acides"
        },
        'conserve': { 
            micro: 'Clostridium sporogenes (survivants)',
            mu_opt: 2.0, b: 0.02, Tmin: 10, Tmax: 55, 
            pH_min: 4.5, pH_opt: 7.0, pH_max: 8.5, 
            aw_min: 0.93, aw_opt: 0.99, 
            N0: 1, Nlim: 1e6,
            source: "Appertisation standards"
        },
        'autre': { 
            micro: 'Microflore totale',
            mu_opt: 4.0, b: 0.05, Tmin: 0, Tmax: 45, 
            pH_min: 4.0, pH_opt: 7.0, pH_max: 9.0, 
            aw_min: 0.92, aw_opt: 0.99, 
            N0: 1e2, Nlim: 1e7,
            source: "Valeurs par défaut prudentes"
        }
    };
    const N_LIMITE = 10000000;

    function calculateMuRatkowsky(temp, params) {
        if (temp <= params.Tmin) return 0;
        if (temp >= params.Tmax) return 0; // Zone létale ou inhibition
        // μ = (b * (T - Tmin))^2
        const mu = Math.pow(params.b * (temp - params.Tmin), 2);
        return mu;
    }

    function getGammaPH(ph, params) {
        if (ph < params.pH_min || ph > params.pH_max) return 0;
        // Modèle Cardinal simplifié (Rosso)
        const numerator = (ph - params.pH_min) * (ph - params.pH_max);
        const denominator = (params.pH_opt - params.pH_min) * (params.pH_opt - params.pH_max);
        const gamma = numerator / (denominator || 1);
        return Math.max(0, Math.min(1, gamma));
    }

    function getGammaAW(aw, params) {
        if (aw < params.aw_min) return 0;
        // Modèle linéaire d'ajustement aw
        const gamma = (aw - params.aw_min) / (params.aw_opt - params.aw_min);
        return Math.max(0, Math.min(1, gamma));
    }

    let growthChart = null;
    function renderGrowthChart(params, mu_final, finalDays) {
        const canvas = document.getElementById('growthChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (growthChart) growthChart.destroy();

        const labels = [];
        const dataPoints = [];
        // On affiche jusqu'à 150% de la durée de vie ou 7 jours min
        const maxDays = Math.max(finalDays * 1.5, 7);
        const steps = 40;
        const limitLog = Math.log10(params.Nlim);

        for (let i = 0; i <= steps; i++) {
            const t = (maxDays / steps) * i;
            // N(t) = N0 * exp(mu * t)
            const N = params.N0 * Math.exp(mu_final * t);
            const logN = Math.log10(N);
            labels.push(t.toFixed(1));
            dataPoints.push(logN);
        }

        growthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Charge Microbienne',
                    data: dataPoints,
                    borderWidth: 3,
                    fill: {
                        target: 'origin',
                        above: 'rgba(99, 102, 241, 0.05)',   
                    },
                    segment: {
                        borderColor: ctx => ctx.p1.parsed.y >= limitLog ? '#ef4444' : '#4ade80',
                    },
                    tension: 0.4,
                    pointRadius: 0
                },
                {
                    label: 'Seuil de sécurité',
                    data: new Array(labels.length).fill(limitLog),
                    borderColor: 'rgba(239, 68, 68, 0.5)',
                    borderDash: [5, 5],
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return ` Log CFU: ${context.parsed.y.toFixed(2)}`;
                            },
                            title: function(context) {
                                return `Jour ${context[0].label}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: { display: true, text: 'Log CFU/g', color: '#94a3b8' },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8' },
                        suggestedMax: limitLog + 1
                    },
                    x: {
                        title: { display: true, text: 'Temps (Jours)', color: '#94a3b8' },
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });
    }

    function calculateShelfLifeLocally(data) {
        const productType = data.produit || 'autre';
        const params = PRODUCTS_DATA[productType] || PRODUCTS_DATA['autre'];
        const temp = parseFloat(data.temperature) || 4.0;
        const ph = parseFloat(data.ph) || 7.0;
        const rh = parseFloat(data.humidite) || 50.0;
        const isOpen = data.produit_ouvert === 'oui';
        
        const prodDate = new Date(data.date_production);
        
        let finalDays = 0;
        let explanation = `--- ANALYSE SCIENTIFIQUE : ${productType.toUpperCase()} ---\n`;
        explanation += `Microbe cible : ${params.micro}\n\n`;

        if (temp <= params.Tmin) {
            finalDays = 999; 
            explanation += `ÉTAT : Température (T=${temp}°C) inférieure ou égale au minimum de croissance (${params.Tmin}°C).\n`;
            explanation += `RÉSULTAT : Croissance bactérienne bloquée. Conservation longue.\n`;
        } else if (temp >= params.Tmax) {
            finalDays = 0;
            explanation += `ÉTAT : Température (T=${temp}°C) dans la zone d'inhibition ou létale (>=${params.Tmax}°C).\n`;
            explanation += `RÉSULTAT : Dégradation thermique rapide ou inhibition totale.\n`;
        } else {
            // 1. Calcul μ_T (Ratkowsky)
            const mu_T = calculateMuRatkowsky(temp, params);
            
            // 2. Facteur Cardinal pH
            const gamma_ph = getGammaPH(ph, params);
            
            // 3. Facteur Cardinal a_w (Basé sur aw_opt du produit)
            // On considère que l'aw est égale à l'aw_opt du produit par défaut.
            const gamma_aw = getGammaAW(params.aw_opt, params); 

            // 4. Calcul μ final
            const mu_final = mu_T * gamma_ph * gamma_aw;

            // 5. Calcul durée de conservation (Équation fondamentale)
            // t = (ln(N_lim) - ln(N0)) / mu
            const t_base = (Math.log(params.Nlim) - Math.log(params.N0)) / (mu_final || 0.0001);
            
            explanation += `1) MODÈLE DE RATKOWSKY (Température)\n`;
            explanation += `   √μ = ${params.b} * (T - (${params.Tmin}))\n`;
            explanation += `   μ_T = ${mu_T.toFixed(4)} jour⁻¹\n\n`;

            explanation += `2) MODÈLE CARDINAL (pH et Humidité)\n`;
            explanation += `   γ(pH=${ph}) = ${gamma_ph.toFixed(3)} (Optimum: ${params.pH_opt})\n`;
            explanation += `   γ(a_w=${params.aw_opt}) = ${gamma_aw.toFixed(3)}\n`;
            explanation += `   μ_final = μ_T * γ(pH) * γ(a_w) = ${mu_final.toFixed(4)} jour⁻¹\n\n`;

            explanation += `3) DURÉE MICROBIOLOGIQUE THÉORIQUE\n`;
            explanation += `   t = (ln(${params.Nlim.toExponential()}) - ln(${params.N0.toExponential()})) / ${mu_final.toFixed(4)}\n`;
            explanation += `   t = ${t_base.toFixed(1)} jours\n\n`;

            // 6. Facteurs de Correction (Statut Ouverture / Chaîne du froid)
            let multiplier = 1.0;
            let adjustments = [];
            
            // Si le produit est ouvert, on réduit la durée de conservation (contamination post-ouverture)
            if (isOpen) { 
                multiplier *= 0.6; // Réduction de 40% (Facteur ~0.6-0.7 suggéré par la littérature)
                adjustments.push("Produit ouvert (Contamination post-ouverture : x0.6)"); 
            }
            if (data.rupture_froid === 'oui') { 
                multiplier *= 0.5; 
                adjustments.push("Rupture chaîne froid (Accélération enzymatique : x0.5)"); 
            }
            if (data.conservateurs === 'oui') { 
                multiplier *= 1.2; 
                adjustments.push("Présence de conservateurs (Inhibition microbienne : x1.2)"); 
            }

            finalDays = Math.max(0, Math.round(t_base * multiplier));

            explanation += `4) FACTEURS D'AJUSTEMENT INDUSTRIELS\n`;
            if (adjustments.length > 0) {
                explanation += adjustments.map(a => `   • ${a}`).join('\n') + "\n";
                explanation += `   Coefficient total : x${multiplier.toFixed(2)}\n`;
            } else {
                explanation += `   • Conditions optimales (scellé, froid continu)\n`;
            }
            explanation += `   DURÉE FINALE ESTIMÉE : ${finalDays} jours\n`;
            
            explanation += `\nSOURCE SCIENTIFIQUE : ${params.source}\n`;
        }

        const estimatedDate = new Date(prodDate);
        estimatedDate.setDate(estimatedDate.getDate() + finalDays);
        
        // Risque basé sur la durée restante par rapport à des seuils standards
        let risk = "Vert";
        if (finalDays <= 2) risk = "Rouge";
        else if (finalDays <= 5) risk = "Orange";

        const result = {
            duree_restante_jours: finalDays,
            nouvelle_date_estimee: estimatedDate.toISOString().split('T')[0],
            niveau_risque: risk,
            explication_scientifique: explanation,
            // Données pour le graphe
            graph_data: {
                params: params,
                mu_final: calculateMuRatkowsky(temp, params) * getGammaPH(ph, params) * getGammaAW(params.aw_opt, params),
                finalDays: finalDays
            }
        };

        return result;
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

        // Render Graph
        if (data.graph_data) {
            renderGrowthChart(data.graph_data.params, data.graph_data.mu_final, data.graph_data.finalDays);
        }
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
            'viande': { ph: 6.2 },
            'viande_hachee': { ph: 6.0 },
            'poisson': { ph: 6.2 },
            'fromage': { ph: 5.5 },
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
            
            // 2. Météo - Fix Humidity Fetch
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=relative_humidity_2m&timezone=auto`;
            const weatherResp = await fetch(weatherUrl);
            if (!weatherResp.ok) throw new Error("Erreur de récupération météo.");
            
            const weatherData = await weatherResp.json();
            
            if (!weatherData.current || weatherData.current.relative_humidity_2m === undefined) {
                throw new Error("Données d'humidité non disponibles pour cette ville.");
            }

            const humidite = weatherData.current.relative_humidity_2m;

            // Populate field
            humInput.value = humidite;

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
