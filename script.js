// ===============================
//  SCRIPT PRINCIPAL - CLUB D'ÉCHECS
// ===============================

// === LISTE OFFICIELLE DES MEMBRES (ROSTER) ===
const roster = [
  { pseudo: "Jean Neba", statut: "Élève" },                                     //Jean Neba, G, TG4
  { pseudo: "Shadow", statut: "Enseignant", startElo: 1773, isPrivate: true },  //Xavier tran
  { pseudo: "El-Amir Ali", statut: "Élève" },                                   //El-Amir Ali, G, 1G1
  { pseudo: "Rayan Benzenati", statut: "Élève" },                               //Rayan Benzenati, G, 1G1
  { pseudo: "Razvan Craciun", statut: "Élève" },                                //Razvan Craciun, G, TG7
  { pseudo: "Hugo Tokiniaina-Nazim", statut: "Élève" },                         //Hugo Tokiniaina-Nazim, G, 1G1
  { pseudo: "Mahmoud Ait-Ouaret", statut: "Élève" },                            //Mahmoud Ait-Ouaret, G, 1STI2D2
  { pseudo: "Adama Basse", statut: "Élève" },                                   //Adama Basse, G, 1TSCRSA
  { pseudo: "Paul-Noah Mondelice", statut: "Élève" },                           //Paul-Noah Mondelice, G, 1TSCRSA
  { pseudo: "Ryan Stary", statut: "Élève" },                                    //Ryan Stary, G, 1TSCRSA
  { pseudo: "Soufian Bouaziz", statut: "Élève" },                               //Soufian Bouaziz, G, 1G7
  { pseudo: "Mohamed-Adam Haouhaou", statut: "Élève" },                         //Mohamed-Adam Haouhaou, G, 1G1
  { pseudo: "Rémi Courouble", statut: "Enseignant", startElo: 1299 },           //Rémi Courouble
  { pseudo: "Brian Phrakousonh", statut: "Enseignant", startElo: 1299 },        //Brian Phrakousonh
];

// === HISTORIQUE DES MATCHS ===
const matches = [
  { "id": 1, "date": "2025-10-13", "player1": "Adama Basse", "player2": "Paul-Noah Mondelice", "result": "win" },
  { "id": 2, "date": "2025-10-13", "player1": "El-Amir", "player2": "Jean Neba", "result": "win" },
  { "id": 3, "date": "2025-10-13", "player1": "Paul-Noah Mondelice", "player2": "Ryan Stary", "result": "win" },
];

let joueurs = [];
const K_FACTOR = 40;
const ELO_INITIAL = 1199;

// === BASE DE DONNÉES DES BADGES ===
const ALL_BADGES = {
    bronze: [
        { id: 'play_1', name: 'Baptême du Feu', desc: 'Jouer son 1er match', icon: 'images/badges/flamme.png', condition: (stats) => stats.totalGames >= 1 },
        { id: 'win_1', name: 'Première Couronne', desc: 'Gagner son 1er match', icon: 'images/badges/couronne.png', condition: (stats) => stats.wins >= 1 },
        { id: 'elo_1250', name: 'Niveau Cavalier', desc: 'Atteindre 1250 Élo', icon: 'images/badges/cavalier.png', condition: (stats) => stats.bestElo >= 1250 },
    ],
    silver: [
        { id: 'play_15', name: 'Habitué du Club', desc: 'Jouer 15 matchs', icon: 'images/badges/club.png', condition: (stats) => stats.totalGames >= 15 },
        { id: 'win_10', name: 'Le Conquérant', desc: 'Gagner 10 matchs', icon: 'images/badges/conquerant.png', condition: (stats) => stats.wins >= 10 },
        { id: 'streak_3', name: 'En Série', desc: '3 victoires de suite', icon: 'images/badges/series.png', condition: (stats) => stats.maxStreak >= 3 },
        { id: 'elo_1400', name: 'Niveau Tour', desc: 'Atteindre 1400 Élo', icon: 'images/badges/tour.png', condition: (stats) => stats.bestElo >= 1400 },
    ],
    gold: [
        { id: 'play_40', name: 'Pilier du Club', desc: 'Jouer 40 matchs', icon: 'images/badges/club_pilier.png', condition: (stats) => stats.totalGames >= 40 },
        { id: 'streak_5', name: 'Intouchable', desc: '5 victoires de suite', icon: 'images/badges/esquive.png', condition: (stats) => stats.maxStreak >= 5 },
        { id: 'elo_1600', name: 'Niveau Dame', desc: 'Atteindre 1600 Élo', icon: 'images/badges/dame.png', condition: (stats) => stats.bestElo >= 1600 },
    ],
    platinum: [
        { id: 'elo_1800', name: 'Niveau Royal', desc: 'Atteindre 1800 Élo', icon: 'images/badges/roi.png', condition: (stats) => stats.bestElo >= 1800 },
        { id: 'champion', name: 'Champion Absolu', desc: 'Gagner un tournoi majeur', icon: 'images/badges/coupe.png', condition: (stats, player) => player.isChampion === true },
    ]
};

const WEEKLY_CHALLENGES = [
    {
        title: "Les Noirs jouent et gagnent du matériel.",
        image: "images/enigmes/challenge_1.jpg",
        solutionText: "1. ... Txh3+<br />2. Rg1 Tg3!<br />3. Dxg3 ... (sacrifice de la Dame pour éviter le mat)",
        solutionImage: "images/enigmes/challenge_1_solution.jpg"
    },
    {
        title: "Les Blancs jouent et gagnent du matériel.",
        image: "images/enigmes/challenge_2.jpg",
        solutionText: "1. Dxd8+ Rxd8 (seul coup possible)<br />2. Ff4+ ... (échec à la découverte et on récupère la dame noire au prochain coup)",
        solutionImage: "images/enigmes/challenge_2_solution.jpg"
    },
    {
        title: "Les Blancs jouent et gagnent en 2 coups.",
        image: "images/enigmes/challenge_3.jpg",
        solutionText: "1. Ta6 ... (seul coup qui gagne).<br />1. ... bxa6<br />.2. b7#",
        solutionImage: "images/enigmes/challenge_3_solution.jpg"
    },
    {
        title: "Les Blancs jouent gagnent en 1 coup.",
        image: "images/enigmes/challenge_4.jpg",
        solutionText: "1. O-O-O# (grand roque)",
        solutionImage: "images/enigmes/challenge_4_solution.jpg"
    },
    {
        title: "Les Blancs jouent et gagnent en 4 coups.",
        image: "images/enigmes/challenge_5.jpg",
        solutionText: "1. Dxd7+ Rxd7 (si Rf8, Dxe7#)<br />2. Ff5+ Re8 (si Rc6, Fd7#)<br />3. Fd7+ Rf8 (ou Rd8)<br />4. Fxe7#",
        solutionImage: "images/enigmes/challenge_5_solution.jpg"
    },
    {
        title: "Les Blancs jouent et gagnent en 3 coups.",
        image: "images/enigmes/challenge_6.jpg",
        solutionText: "1. Dg8+ Txg8<br />2.Cxf7+ Rg7<br />3.Fh6#",
        solutionImage: "images/enigmes/challenge_6_solution.jpg"
    },
    {
        title: "Les Blancs jouent et gagnent en 3 coups.",
        image: "images/enigmes/challenge_7.jpg",
        solutionText: "1. Db6+ Fxb6<br />2. axb6 Rxb6<br />3. Fe3#",
        solutionImage: "images/enigmes/challenge_7_solution.jpg"
    },
    {
        title: "Les Blancs jouent gagnent en 2 coups.",
        image: "images/enigmes/challenge_8.jpg",
        solutionText: "1. Dxf5+ exf5<br />2. Tg8#",
        solutionImage: "images/enigmes/challenge_8_solution.jpg"
    }
];

// ===============================
//          FONCTIONS DE CALCUL
// ===============================

function calculateNewElo(eloA, eloB, scoreA) {
  const expectedA = 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
  const expectedB = 1 - expectedA;
  const scoreB = 1 - scoreA;
  const newEloA = eloA + K_FACTOR * (scoreA - expectedA);
  const newEloB = eloB + K_FACTOR * (scoreB - expectedB);
  return { newEloA: Math.round(newEloA), newEloB: Math.round(newEloB) };
}

function getRankFromElo(elo) {
  if (elo > 1800) return "Roi-4"; if (elo >= 1800) return "Roi-3"; if (elo >= 1750) return "Roi-2"; if (elo >= 1700) return "Roi-1"; if (elo >= 1650) return "Dame-4"; if (elo >= 1600) return "Dame-3"; if (elo >= 1550) return "Dame-2"; if (elo >= 1500) return "Dame-1"; if (elo >= 1450) return "Tour-3"; if (elo >= 1400) return "Tour-2"; if (elo >= 1350) return "Tour-1"; if (elo >= 1300) return "Cavalier-3"; if (elo >= 1250) return "Cavalier-2"; if (elo >= 1200) return "Cavalier-1"; if (elo >= 1150) return "Fou-3"; if (elo >= 1100) return "Fou-2"; if (elo >= 1050) return "Fou-1"; return "Pion";
}

function processAllMatches() {
    joueurs = roster.map(membre => {
        const startingElo = membre.startElo || ELO_INITIAL;
        return { 
            pseudo: membre.pseudo, classe: membre.statut, elo: startingElo, 
            eloHistory: [{ date: "Début", elo: startingElo }], isPrivate: membre.isPrivate || false,
            isChampion: membre.isChampion || false
        };
    });
    const sortedMatches = [...matches].sort((a, b) => new Date(a.date) - new Date(b.date));
    sortedMatches.forEach(match => {
        const joueurA = joueurs.find(j => j.pseudo === match.player1);
        const joueurB = joueurs.find(j => j.pseudo === match.player2);
        if (!joueurA || !joueurB) return;
        let scoreA = match.result === 'win' ? 1 : (match.result === 'draw' ? 0.5 : 0);
        const oldEloA = joueurA.elo;
        const oldEloB = joueurB.elo;
        const { newEloA, newEloB } = calculateNewElo(oldEloA, oldEloB, scoreA);
        joueurA.elo = newEloA; joueurB.elo = newEloB;
        joueurA.eloHistory.push({ date: match.date, elo: newEloA, eloChange: newEloA - oldEloA });
        joueurB.eloHistory.push({ date: match.date, elo: newEloB, eloChange: newEloB - oldEloB });
    });
}

function calculatePlayerStats(playerpseudo) {
    const playerMatches = matches.filter(m => m.player1 === playerpseudo || m.player2 === playerpseudo).sort((a, b) => new Date(a.date) - new Date(b.date));
    let wins = 0, losses = 0, draws = 0, currentStreak = 0, maxStreak = 0, streakCounter = 0;
    let opponents = {};
    playerMatches.forEach(m => {
        const isPlayer1 = m.player1 === playerpseudo;
        const opponentName = isPlayer1 ? m.player2 : m.player1;
        opponents[opponentName] = (opponents[opponentName] || 0) + 1;
        const won = (isPlayer1 && m.result === 'win') || (!isPlayer1 && m.result === 'loss');
        if (m.result === 'draw') { draws++; streakCounter = 0; } 
        else if (won) { wins++; streakCounter++; } 
        else { losses++; streakCounter = 0; }
        if (streakCounter > maxStreak) maxStreak = streakCounter;
    });
    for (let i = playerMatches.length - 1; i >= 0; i--) { const m = playerMatches[i]; const won = (m.player1 === playerpseudo && m.result === 'win') || (m.player2 === playerpseudo && m.result === 'loss'); if (won) { currentStreak++; } else { break; } }
    
    const totalGames = playerMatches.length;
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
    const advantage = wins - losses;
    const playerData = joueurs.find(j => j.pseudo === playerpseudo);
    const bestElo = playerData ? Math.max(...playerData.eloHistory.map(h => h.elo)) : 0;
    const rival = Object.keys(opponents).length > 0 ? Object.entries(opponents).sort((a,b) => b[1] - a[1])[0][0] : "Aucun";
    
    const earnedBadges = {};
    const badgeCounts = { bronze: 0, silver: 0, gold: 0, platinum: 0 };
    const statsForBadges = { totalGames, wins, bestElo, maxStreak };
    for (const tier in ALL_BADGES) {
        earnedBadges[tier] = ALL_BADGES[tier].filter(badge => badge.condition(statsForBadges, playerData));
        badgeCounts[tier] = earnedBadges[tier].length;
    }

    return { totalGames, wins, losses, draws, winRate, bestElo, advantage, currentStreak, rival, earnedBadges, badgeCounts };
}

// ===============================
//         FONCTIONS D'AFFICHAGE
// ===============================

let eloChartInstance = null;
let resultsChartInstance = null;

function displayPlayerProfile(player) {
    if (!player) return;

    const profileWrapper = document.querySelector('#elo .space-y-8');
    const allContainers = [
        document.getElementById('player-stats-kpi'), document.getElementById('results-chart')?.parentElement,
        document.getElementById('elo-chart')?.parentElement, document.getElementById('recent-matches-list')?.parentElement,
        document.getElementById('player-trophies-container'), document.querySelector('#badge-accordion-content')?.parentElement
    ].filter(Boolean);

    if (player.isPrivate) {
        allContainers.forEach(container => { if (container) container.style.display = 'none'; });
        let privateMessage = document.getElementById('private-profile-message');
        if (!privateMessage) {
            privateMessage = document.createElement('div');
            privateMessage.id = 'private-profile-message';
            privateMessage.className = 'text-center text-ivory/80 bg-charcoal-light p-8 rounded-xl';
            if (profileWrapper) profileWrapper.prepend(privateMessage);
        }
        privateMessage.innerHTML = `<p class="text-3xl mb-2">🔒</p><p>Ce profil est privé.</p>`;
        privateMessage.style.display = 'block';
        return;
    }

    const privateMessage = document.getElementById('private-profile-message');
    if (privateMessage) privateMessage.style.display = 'none';
    allContainers.forEach(container => { if (container) container.style.display = 'block'; });
    
    const stats = calculatePlayerStats(player.pseudo);
    const rang = getRankFromElo(player.elo);
    
    document.getElementById('stat-rank').textContent = rang;
    document.getElementById('stat-total-games').textContent = stats.totalGames;
    document.getElementById('stat-win-rate').textContent = stats.winRate;
    document.getElementById('stat-best-elo').textContent = stats.bestElo;
    document.getElementById('stat-current-streak').textContent = stats.currentStreak;

    document.getElementById('stat-badge-bronze').textContent = stats.badgeCounts.bronze;
    document.getElementById('stat-badge-silver').textContent = stats.badgeCounts.silver;
    document.getElementById('stat-badge-gold').textContent = stats.badgeCounts.gold;
    document.getElementById('stat-badge-platinum').textContent = stats.badgeCounts.platinum;

    const badgeContent = document.getElementById('badge-accordion-content');
    if (badgeContent) {
        badgeContent.innerHTML = '';
        for (const tier in ALL_BADGES) {
            let tierHtml = `<div class="mb-6"><h4 class="text-xl font-bold capitalize mb-3" style="color: ${tier === 'bronze' ? '#cd7f32' : tier === 'silver' ? '#c0c0c0' : tier === 'gold' ? '#ffd700' : '#e5e4e2'}">${tier}</h4><div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">`;
            ALL_BADGES[tier].forEach(badge => {
                const isEarned = stats.earnedBadges[tier].some(earned => earned.id === badge.id);
                tierHtml += `
                    <div class="text-center p-2 rounded-lg ${isEarned ? 'opacity-100' : 'opacity-40 grayscale'}">
                        <img src="${badge.icon}" alt="${badge.name}" class="w-20 h-20 mx-auto">
                        <div class="text-sm font-semibold mt-1">${badge.name}</div>
                        <div class="text-xs text-ivory/60">${badge.desc}</div>
                    </div>
                `;
            });
            tierHtml += `</div></div>`;
            badgeContent.innerHTML += tierHtml;
        }
    }

    const resultsCtx = document.getElementById('results-chart')?.getContext('2d');
    if (resultsCtx) {
        if (resultsChartInstance) resultsChartInstance.destroy();
        resultsChartInstance = new Chart(resultsCtx, { type: 'doughnut', data: { labels: ['Victoires', 'Défaites', 'Nuls'], datasets: [{ data: [stats.wins, stats.losses, stats.draws], backgroundColor: ['#2a9d8f', '#e76f51', '#e9c46a'], borderColor: '#444' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: `Avantage : ${stats.advantage > 0 ? '+' : ''}${stats.advantage}`, color: '#f5f5f5', font: { size: 16 } }, legend: { position: 'bottom', labels: { color: '#f5f5f5' } } } } });
    }

    const eloCtx = document.getElementById('elo-chart')?.getContext('2d');
    if (eloCtx) {
        if (eloChartInstance) eloChartInstance.destroy();
        eloChartInstance = new Chart(eloCtx, { type: 'line', data: { labels: player.eloHistory.map(h => h.date), datasets: [{ label: `Progression ELO de ${player.pseudo}`, data: player.eloHistory.map(h => h.elo), borderColor: '#f4a261', backgroundColor: 'rgba(244, 162, 97, 0.2)', borderWidth: 2, tension: 0.3, fill: true }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: false, ticks: { color: '#f5f5f5' }, grid: { color: 'rgba(245, 245, 245, 0.1)' } }, x: { ticks: { color: '#f5f5f5' }, grid: { color: 'rgba(245, 245, 245, 0.1)' } } }, plugins: { legend: { display: false } } } });
    }

    const recentMatchesList = document.getElementById('recent-matches-list');
    if (recentMatchesList) {
        recentMatchesList.innerHTML = '';
        const playerMatches = matches.filter(m => m.player1 === player.pseudo || m.player2 === player.pseudo).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        if (playerMatches.length === 0) {
            recentMatchesList.innerHTML = `<li class="text-ivory/70">Aucun match enregistré.</li>`;
        } else {
            playerMatches.forEach(match => {
                const opponent = match.player1 === player.pseudo ? match.player2 : match.player1;
                const historyEntry = player.eloHistory.find(h => h.date === match.date);
                const eloChange = historyEntry ? Math.round(historyEntry.eloChange) : 0;
                let resultText, resultColor, eloColor, sign;
                if (eloChange > 0) { resultColor = 'text-green-400'; eloColor = 'text-green-400'; sign = '+'; resultText = 'Victoire'; }
                else if (eloChange < 0) { resultColor = 'text-red-400'; eloColor = 'text-red-400'; sign = ''; resultText = 'Défaite'; }
                else { resultColor = 'text-yellow-400'; eloColor = 'text-gray-400'; sign = ''; resultText = 'Nul'; }
                if (match.result === 'draw') resultText = 'Nul';
                const li = document.createElement('li');
                li.className = 'flex justify-between items-center bg-charcoal p-3 rounded-lg';
                li.innerHTML = `<div>vs. <span class="font-semibold">${opponent}</span></div><div class="flex items-center space-x-4"><span class="font-bold ${eloColor}">(${sign}${eloChange})</span><span class="font-bold ${resultColor}">${resultText}</span></div>`;
                recentMatchesList.appendChild(li);
            });
        }
    }
    
    const trophiesContainer = document.getElementById('player-trophies-content');
    if (trophiesContainer) {
        trophiesContainer.innerHTML = `<div class="bg-charcoal rounded-lg p-4 text-center"><div class="text-lg font-bold text-sandy">Le Rival</div><div class="text-2xl text-ivory mt-2">${stats.rival}</div><div class="text-sm text-ivory/80">Adversaire le plus fréquent</div></div><div class="bg-charcoal rounded-lg p-4 text-center"><div class="text-lg font-bold text-sandy">Plus Grande Surprise</div><div class="text-2xl text-ivory mt-2">N/A</div><div class="text-sm text-ivory/80">Victoire la plus marquante</div></div>`;
    }
}

function updateLeaderboardDisplay() {
  const tableBody = document.querySelector('#leaderboard-body');
  if (!tableBody) return;

  // 👇 LIGNE AJOUTÉE : On crée une nouvelle liste qui exclut les joueurs privés.
  const publicJoueurs = joueurs.filter(joueur => !joueur.isPrivate);

  // On trie cette nouvelle liste de joueurs publics par Élo.
  publicJoueurs.sort((a, b) => b.elo - a.elo);
  
  tableBody.innerHTML = '';
  // On utilise maintenant la liste "publicJoueurs" pour afficher le tableau.
  publicJoueurs.forEach((joueur, index) => {
    const nameClass = (index + 1) === 1 ? 'text-sandy font-semibold' : 'text-ivory';
    const rang = getRankFromElo(joueur.elo);
    // Le classement (index + 1) est maintenant basé sur la liste publique.
    const playerRow = `
      <tr class="border-b border-ivory/20">
        <td class="py-4 px-4 text-ivory">${index + 1}</td>
        <td class="py-4 px-4 ${nameClass}">${joueur.pseudo}</td>
        <td class="py-4 px-4 text-ivory">${joueur.elo}</td>
        <td class="py-4 px-4 text-ivory">${joueur.classe}</td>
        <td class="py-4 px-4 text-ivory">${rang}</td>
      </tr>`;
    tableBody.innerHTML += playerRow;
  });
}

function refreshUI() {
    updateLeaderboardDisplay();
    const studentSelect = document.querySelector('#student-select');
    if (studentSelect && studentSelect.value) {
        const selectedPlayer = joueurs.find(j => j.pseudo === studentSelect.value);
        displayPlayerProfile(selectedPlayer);
    } else if (studentSelect) {
        const firstPublicPlayer = joueurs.find(j => !j.isPrivate);
        if (firstPublicPlayer) {
            studentSelect.value = firstPublicPlayer.pseudo;
            displayPlayerProfile(firstPublicPlayer);
        } else {
             displayPlayerProfile({ isPrivate: true });
        }
    }
}

// === COMMANDES DE GESTION (via la console) ===
window.addPlayer = function(pseudo, classe) { const newMember = { pseudo, classe }; console.log("✅ Joueur ajouté ! Copiez la ligne ci-dessous et collez-la dans la liste 'roster' :"); console.log(JSON.stringify(newMember, null, 2) + ','); roster.push(newMember); processAllMatches(); refreshUI(); };
window.recordMatch = function(player1, player2, result) { const newMatch = { id: matches.length + 1, date: new Date().toISOString().split('T')[0], player1, player2, result }; console.log("✅ Match enregistré ! Copiez la ligne ci-dessous et collez-la dans la liste 'matches' :"); console.log(JSON.stringify(newMatch, null, 2) + ','); matches.push(newMatch); processAllMatches(); refreshUI(); };

// === INITIALISATION DE LA PAGE ===
document.addEventListener('DOMContentLoaded', () => {
    // Logique qui s'exécute sur TOUTES les pages
    setupMobileMenu();
    setupSolutionButton();
    setupAccordions();

    // Logique qui s'exécute SEULEMENT sur la page d'accueil
    if (document.getElementById('leaderboard-body')) {
        processAllMatches();
        updateLeaderboardDisplay();
        setupProgressionSection();
        setupWeeklyChallenge();
    }
});

// ===============================
//    FONCTIONS D'INITIALISATION
// ===============================

function setupWeeklyChallenge() {
    // Fonction utilitaire pour obtenir le numéro de la semaine dans l'année
    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    }

    const today = new Date();
    const weekNumber = getWeekNumber(today);
    // On utilise le modulo (%) pour boucler sur la liste si on a plus de semaines que de challenges
    const challenge = WEEKLY_CHALLENGES[weekNumber % WEEKLY_CHALLENGES.length];

    // On met à jour le HTML avec les informations du challenge choisi
    const titleEl = document.getElementById('challenge-title');
    const imageEl = document.getElementById('challenge-image');
    const solutionTextEl = document.getElementById('challenge-solution-text');
    const solutionImageEl = document.getElementById('challenge-solution-image');

    if (titleEl && imageEl && solutionTextEl && solutionImageEl) {
        titleEl.textContent = challenge.title;
        imageEl.src = challenge.image;
        solutionTextEl.innerHTML = challenge.solutionText;
        solutionImageEl.src = challenge.solutionImage;
    }
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => { mobileMenu.classList.toggle('hidden'); });
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => { mobileMenu.classList.add('hidden'); });
        });
    }
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
}

function setupSolutionButton() {
    document.getElementById('solution-button')?.addEventListener('click', () => {
        document.getElementById('solution-box')?.classList.toggle('hidden');
    });
}

function setupAccordions() {
    const accordions = document.querySelectorAll('.accordion-trigger');
    accordions.forEach(accordion => {
        accordion.addEventListener('click', () => {
            const content = accordion.nextElementSibling;
            const icon = accordion.querySelector('.accordion-icon');
            if(content) content.classList.toggle('hidden');
            if (icon) icon.textContent = content.classList.contains('hidden') ? '+' : '−';
        });
    });
}

function setupProgressionSection() {
    const studentSelect = document.querySelector('#student-select');
    if (!studentSelect) return;
    studentSelect.innerHTML = '';
    const publicPlayers = joueurs.filter(j => !j.isPrivate);
    const sortedPlayers = publicPlayers.sort((a, b) => a.pseudo.localeCompare(b.pseudo));
    sortedPlayers.forEach(joueur => {
        const option = document.createElement('option');
        option.value = joueur.pseudo;
        option.textContent = joueur.pseudo;
        studentSelect.appendChild(option);
    });
    studentSelect.addEventListener('change', (event) => {
        const selectedPlayer = joueurs.find(j => j.pseudo === event.target.value);
        displayPlayerProfile(selectedPlayer);
    });
    if (sortedPlayers.length > 0) {
        displayPlayerProfile(sortedPlayers[0]);
    } else {
        displayPlayerProfile({ isPrivate: true });
    }
}
