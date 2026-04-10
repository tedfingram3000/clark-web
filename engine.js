/**
 * 700 Clark Intelligence Engine - v4.3 (Complete Production Build)
 * Architecture: Headless Matchup Intelligence
 * Branding: Midnight Navy / Slate / Scout Palette
 */

const CLARK_PALETTE = {
    navy: '#0B1C33',
    slate: '#2D3640',
    grey: '#F4F4F4',
    green: '#2E7D32',
    amber: '#B8860B',
    rust: '#8B3A3A',
    white: '#FFFFFF'
};

const EngineUtils = {
    /**
     * Maps a percentage to SVG coordinates on a 180-degree arc.
     * 0% = 180deg (Left), 100% = 0deg (Right)
     */
    getPointerCoords(percent, radius, cx, cy) {
        const angleInDegrees = 180 - (percent * 1.8);
        const angleInRadians = (angleInDegrees * Math.PI) / 180;
        return {
            x: cx + radius * Math.cos(angleInRadians),
            y: cy - radius * Math.sin(angleInRadians)
        };
    },

    formatStat(val, decimals = 3) {
        if (typeof val !== 'number') return "---";
        return val > 0 ? `+${val.toFixed(decimals)}` : val.toFixed(decimals);
    }
};

/**
 * MODULE: Fireman Gauge
 * Visualizes reliever efficiency vs league average.
 */
const FiremanGauge = {
    render(pitcher, leagueAvg = 72) {
        const strandRate = pitcher?.inherited_runners?.ir_strand_pct;
        const name = pitcher?.name || "Pitcher";
        const hasData = typeof strandRate === 'number';
        const percent = hasData ? Math.min(Math.max(strandRate, 0), 100) : 0;

        const needleEnd = EngineUtils.getPointerCoords(percent, 35, 50, 50);
        // League Avg Tick: Shortened per v4.2 (radius 36 to 44)
        const lTickStart = EngineUtils.getPointerCoords(leagueAvg, 36, 50, 50);
        const lTickEnd = EngineUtils.getPointerCoords(leagueAvg, 44, 50, 50);

        return `
            <div class="clark-card" style="font-family:'IBM Plex Sans'; width:220px; text-align:center; padding:20px; border:1px solid #E0E0E0; border-radius:8px; background:#FFF; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <p style="font-size:10px; font-weight:700; color:#707070; text-transform:uppercase; margin-bottom:12px; letter-spacing:1px;">Fireman Efficiency</p>
                <svg viewBox="0 0 100 60" width="100%">
                    <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="${CLARK_PALETTE.grey}" stroke-width="8" stroke-linecap="round"/>
                    <path d="M10,50 A40,40 0 0,1 73.5,17.6" fill="none" stroke="${CLARK_PALETTE.rust}" stroke-width="8" opacity="0.2"/>
                    <path d="M73.5,17.6 A40,40 0 0,1 82.4,26.5" fill="none" stroke="${CLARK_PALETTE.amber}" stroke-width="8" opacity="0.2"/>
                    <path d="M82.4,26.5 A40,40 0 0,1 90,50" fill="none" stroke="${CLARK_PALETTE.green}" stroke-width="8" opacity="0.2"/>
                    
                    <line x1="${lTickStart.x}" y1="${lTickStart.y}" x2="${lTickEnd.x}" y2="${lTickEnd.y}" stroke="${CLARK_PALETTE.slate}" stroke-width="1.5" />
                    
                    ${hasData ? `
                        <line x1="50" y1="50" x2="${needleEnd.x}" y2="${needleEnd.y}" stroke="${CLARK_PALETTE.navy}" stroke-width="2.5" stroke-linecap="round" />
                        <circle cx="50" cy="50" r="3.5" fill="${CLARK_PALETTE.navy}" />
                    ` : ''}
                </svg>
                <div style="font-size:15px; font-weight:700; color:${CLARK_PALETTE.navy}; margin:8px 0 2px 0;">${name}</div>
                <div style="font-size:11px; color:${CLARK_PALETTE.slate}; font-weight:700;">${hasData ? strandRate + '%' : 'DATA PENDING'}</div>
            </div>`;
    }
};

/**
 * MODULE: Collision Meter
 * Visualizes Stylistic overlap between Pitcher and Batter.
 */
const CollisionMeter = {
    render(pitcher, batter, leagueGB = 43.2, threshold = 85) {
        const pGB = pitcher?.gb_pct || 0;
        const bLD = batter?.historical?.batted_ball?.ld_pct || 0;
        const combined = pGB + bLD;
        const isVolatile = combined > threshold;

        return `
            <div class="clark-card" style="font-family:'IBM Plex Sans'; width:340px; padding:20px; border:1px solid #E0E0E0; border-radius:8px; background:#FFF; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <p style="font-size:10px; font-weight:700; color:#707070; text-transform:uppercase; margin-bottom:15px; letter-spacing:1px;">Style Clash: GB Floor vs LD Ceiling</p>
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:11px; font-weight:700;">
                    <span style="color:${CLARK_PALETTE.navy};">${pitcher?.name || 'Pitcher'} (GB)</span>
                    <span style="color:${CLARK_PALETTE.slate};">${batter?.name || 'Batter'} (LD)</span>
                </div>
                <div style="height:14px; background:${CLARK_PALETTE.grey}; border-radius:7px; position:relative; overflow:hidden; margin-bottom:15px;">
                    <div style="position:absolute; left:0; height:100%; width:${pGB}%; background:${CLARK_PALETTE.navy}; transition: width 0.4s ease;"></div>
                    <div style="position:absolute; right:0; height:100%; width:${bLD}%; background:${CLARK_PALETTE.slate}; transition: width 0.4s ease;"></div>
                    ${isVolatile ? `<div style="position:absolute; left:${Math.max(0, 100 - bLD - (combined - 100))}%; right:${Math.max(0, 100 - pGB)}%; height:100%; background:${CLARK_PALETTE.amber}; opacity:0.4;"></div>` : ''}
                    <div style="position:absolute; left:${leagueGB}%; width:1px; height:100%; background:${CLARK_PALETTE.white}; opacity:0.6;"></div>
                </div>
                <div style="padding:10px; background:${isVolatile ? '#FFF9E6' : '#FAFAFA'}; border-radius:4px; border:1px solid ${isVolatile ? CLARK_PALETTE.amber : '#E0E0E0'};">
                    <p style="font-size:11px; color:${CLARK_PALETTE.slate}; margin:0; line-height:1.4;">
                        ${isVolatile ? `<b style="color:${CLARK_PALETTE.amber};">VOLATILITY ALERT:</b> Combined non-flyball rate of ${combined.toFixed(1)}%. Expect high-velocity contact.` : `<b>STABLE MATCHUP:</b> Low stylistic overlap (${combined.toFixed(1)}%). Advantage favors defensive positioning.`}
                    </p>
                </div>
            </div>`;
    }
};

/**
 * MODULE: Situational Diamond
 * Visualizes situational delta vs season baseline.
 */
const SituationalDiamond = {
    render(batter, thresholds = { advantage: 0.050, disadvantage: -0.050, smallSample: 10 }) {
        const sit = batter?.situational;
        // v4.3 Fallback: bases_empty -> season ops -> 0
        const emptyOps = parseFloat(sit?.bases_empty?.ops || batter?.season?.ops || 0);
        
        const getBase = (data) => {
            if (!data) return { color: CLARK_PALETTE.slate, dashed: false, delta: 0 };
            const delta = parseFloat(data.ops || 0) - emptyOps;
            let color = CLARK_PALETTE.slate;
            if (delta >= thresholds.advantage) color = CLARK_PALETTE.green;
            else if (delta <= thresholds.disadvantage) color = CLARK_PALETTE.rust;
            return { color, dashed: (data.pa || 0) < thresholds.smallSample, delta };
        };

        const b2 = getBase(sit?.risp);
        const b3 = getBase(sit?.bases_loaded);

        return `
            <div class="clark-card" style="font-family:'IBM Plex Sans'; width:260px; text-align:center; padding:20px; border:1px solid #E0E0E0; border-radius:8px; background:#FFF; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <p style="font-size:10px; font-weight:700; color:#707070; text-transform:uppercase; margin-bottom:15px; letter-spacing:1px;">Situational Edge (vs Baseline)</p>
                <svg viewBox="0 0 100 100" width="140" style="margin: 0 auto;">
                    <path d="M50,90 L90,50 L50,10 L10,50 Z" fill="none" stroke="${CLARK_PALETTE.navy}" stroke-width="1" opacity="0.3" />
                    <path d="M47,90 L53,90 L53,86 L50,83 L47,86 Z" fill="${CLARK_PALETTE.slate}" opacity="0.6" />
                    <rect x="45" y="5" width="10" height="10" transform="rotate(45 50 10)" fill="${b2.color}" stroke="${CLARK_PALETTE.white}" stroke-width="1" style="${b2.dashed ? 'stroke-dasharray:2,1;' : ''}" />
                    <rect x="5" y="45" width="10" height="10" transform="rotate(45 10 50)" fill="${b3.color}" stroke="${CLARK_PALETTE.white}" stroke-width="1" style="${b3.dashed ? 'stroke-dasharray:2,1;' : ''}" />
                </svg>
                <div style="margin-top:12px; font-size:15px; font-weight:700; color:${CLARK_PALETTE.navy};">${batter?.name || 'Select Batter'}</div>
                <div style="display:flex; justify-content:center; gap:12px; margin-top:4px; font-size:10px; font-weight:700;">
                    <span style="color:${b2.color};">2B: ${EngineUtils.formatStat(b2.delta)}</span>
                    <span style="color:${b3.color};">3B: ${EngineUtils.formatStat(b3.delta)}</span>
                </div>
            </div>`;
    }
};

/**
 * MODULE: Matchup Simulator / Scouting Note
 * Deterministic priority-based narrative generator.
 */
const MatchupSimulator = {
    getNote(pitcher, batter) {
        if (!pitcher || !batter) return "Select a matchup to generate scouting intelligence.";

        const pK = pitcher?.season?.k_pct || pitcher?.k_pct || 0;
        const bK = batter?.season?.k_pct || 0;
        const bvp = batter?.historical?.bvp_vs_starter;
        const vsHand = batter?.historical?.vs_hand;

        // Priority 1: Career BvP (Sample size >= 10)
        if (bvp && bvp.pa >= 10 && parseFloat(bvp.avg) >= .300) {
            return `<b>BvP ADVANTAGE:</b> ${batter.name} is ${bvp.avg} in ${bvp.pa} PA against ${pitcher.name}. History favors the hitter.`;
        }

        // Priority 2: Platoon Splits
        if (vsHand && parseFloat(vsHand.ops) > .850) {
            return `<b>PLATOON MISMATCH:</b> ${batter.name} owns ${vsHand.hand}-handed pitching (${vsHand.ops} OPS). Clear situational edge.`;
        }

        // Priority 3: Strikeout Traits
        if (bK < 15 && pK < 18) {
            return `<b>CONTACT FOCUS:</b> ${batter.name}'s elite ${bK}% K-rate negates ${pitcher.name}'s reliance on contact. Expect a high-velocity duel.`;
        }

        return "<b>NEUTRAL MATCHUP:</b> No significant historical or situational edge detected. Advantage favors defensive positioning.";
    }
};

/**
 * GLOBAL INITIALIZER
 * Wires the DAILY_DATA to the UI targets and handles interactive state.
 */
window.init700ClarkEngine = function(data) {
    if (!data) return;

    const targets = {
        gauge: document.getElementById('fireman-gauge-target'),
        collision: document.getElementById('collision-meter-target'),
        diamond: document.getElementById('situational-diamond-target'),
        note: document.getElementById('scouting-note-target'),
        pSelect: document.getElementById('pitcher-select'),
        bSelect: document.getElementById('batter-select')
    };

    const updateMatchup = () => {
        const pitcherId = targets.pSelect?.value;
        const batterId = targets.bSelect?.value;

        // Flatten rosters for lookup
        const allPitchers = [
            data.starters?.cardinals, 
            data.starters?.opponent,
            ...(data.roster?.cardinals?.pitchers || []),
            ...(data.roster?.opponent?.pitchers || [])
        ].filter(Boolean);

        const allBatters = [
            ...(data.roster?.cardinals?.batters || []),
            ...(data.roster?.opponent?.batters || [])
        ];

        const p = allPitchers.find(p => p.person_id == pitcherId) || data.starters?.opponent;
        const b = allBatters.find(b => b.person_id == batterId) || data.roster?.cardinals?.batters?.[0];

        // Render Components
        if (targets.gauge) targets.gauge.innerHTML = FiremanGauge.render(p, data.league_benchmarks?.avg_ir_strand_pct);
        if (targets.collision) targets.collision.innerHTML = CollisionMeter.render(p, b, data.league_benchmarks?.avg_gb_pct, data.thresholds?.collision_meter?.volatility_threshold);
        if (targets.diamond) targets.diamond.innerHTML = SituationalDiamond.render(b, data.thresholds?.situational_diamond);
        if (targets.note) targets.note.innerHTML = MatchupSimulator.getNote(p, b);
    };

    // Event Listeners
    if (targets.pSelect) targets.pSelect.addEventListener('change', updateMatchup);
    if (targets.bSelect) targets.bSelect.addEventListener('change', updateMatchup);

    // Initial Render
    updateMatchup();
};
