/**
 * 700 Clark Intelligence Engine - v4.3+Selectors (Production Build)
 * Architecture: Headless Matchup Intelligence
 * Self-constructing: builds pitcher/batter dropdowns from DAILY_DATA.roster
 */

var CLARK_PALETTE = {
    navy: '#0B1C33',
    slate: '#2D3640',
    grey: '#F4F4F4',
    green: '#2E7D32',
    amber: '#B8860B',
    rust: '#8B3A3A',
    white: '#FFFFFF'
};

var EngineUtils = {
    getPointerCoords: function(percent, radius, cx, cy) {
        var angleInDegrees = 180 - (percent * 1.8);
        var angleInRadians = (angleInDegrees * Math.PI) / 180;
        return {
            x: cx + radius * Math.cos(angleInRadians),
            y: cy - radius * Math.sin(angleInRadians)
        };
    },
    formatStat: function(val, decimals) {
        if (decimals === undefined) decimals = 3;
        if (typeof val !== 'number') return '---';
        return val > 0 ? '+' + val.toFixed(decimals) : val.toFixed(decimals);
    }
};

var FiremanGauge = {
    render: function(pitcher, leagueAvg) {
        if (leagueAvg === undefined) leagueAvg = 72;
        var strandRate = pitcher && pitcher.inherited_runners ? pitcher.inherited_runners.ir_strand_pct : undefined;
        var name = (pitcher && pitcher.name) || 'Pitcher';
        var hasData = typeof strandRate === 'number';
        var percent = hasData ? Math.min(Math.max(strandRate, 0), 100) : 0;
        var needleEnd = EngineUtils.getPointerCoords(percent, 35, 50, 50);
        var lTickStart = EngineUtils.getPointerCoords(leagueAvg, 36, 50, 50);
        var lTickEnd = EngineUtils.getPointerCoords(leagueAvg, 44, 50, 50);

        var s = '<div style="font-family:\'IBM Plex Sans\',sans-serif; width:100%; max-width:220px; text-align:center; padding:20px; border:1px solid #E0E0E0; border-radius:8px; background:#FFF; box-shadow:0 2px 4px rgba(0,0,0,0.05); margin:0 auto;">';
        s += '<p style="font-size:10px; font-weight:700; color:#707070; text-transform:uppercase; margin:0 0 12px 0; letter-spacing:1px;">Fireman Efficiency</p>';
        s += '<svg viewBox="0 0 100 60" width="100%">';
        s += '<path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="' + CLARK_PALETTE.grey + '" stroke-width="8" stroke-linecap="round"/>';
        s += '<path d="M10,50 A40,40 0 0,1 73.5,17.6" fill="none" stroke="' + CLARK_PALETTE.rust + '" stroke-width="8" opacity="0.2"/>';
        s += '<path d="M73.5,17.6 A40,40 0 0,1 82.4,26.5" fill="none" stroke="' + CLARK_PALETTE.amber + '" stroke-width="8" opacity="0.2"/>';
        s += '<path d="M82.4,26.5 A40,40 0 0,1 90,50" fill="none" stroke="' + CLARK_PALETTE.green + '" stroke-width="8" opacity="0.2"/>';
        s += '<line x1="' + lTickStart.x.toFixed(1) + '" y1="' + lTickStart.y.toFixed(1) + '" x2="' + lTickEnd.x.toFixed(1) + '" y2="' + lTickEnd.y.toFixed(1) + '" stroke="' + CLARK_PALETTE.slate + '" stroke-width="1.5"/>';
        if (hasData) {
            s += '<line x1="50" y1="50" x2="' + needleEnd.x.toFixed(1) + '" y2="' + needleEnd.y.toFixed(1) + '" stroke="' + CLARK_PALETTE.navy + '" stroke-width="2.5" stroke-linecap="round"/>';
            s += '<circle cx="50" cy="50" r="3.5" fill="' + CLARK_PALETTE.navy + '"/>';
        }
        s += '</svg>';
        s += '<div style="font-size:15px; font-weight:700; color:' + CLARK_PALETTE.navy + '; margin:8px 0 2px 0;">' + name + '</div>';
        s += '<div style="font-size:11px; color:' + CLARK_PALETTE.slate + '; font-weight:700;">' + (hasData ? strandRate + '%' : 'DATA PENDING') + '</div>';
        s += '</div>';
        return s;
    }
};

var CollisionMeter = {
    render: function(pitcher, batter, leagueGB, threshold) {
        if (leagueGB === undefined) leagueGB = 43.2;
        if (threshold === undefined) threshold = 85;
        var pGB = (pitcher && pitcher.gb_pct) || 0;
        var bLD = (batter && batter.historical && batter.historical.batted_ball) ? batter.historical.batted_ball.ld_pct || 0 : 0;
        var combined = pGB + bLD;
        var isVolatile = combined > threshold;
        var pName = (pitcher && pitcher.name) || 'Pitcher';
        var bName = (batter && batter.name) || 'Batter';
        var overlapLeft = Math.max(0, 100 - bLD - (combined - 100));
        var overlapRight = Math.max(0, 100 - pGB);

        var s = '<div style="font-family:\'IBM Plex Sans\',sans-serif; width:100%; max-width:400px; padding:20px; border:1px solid #E0E0E0; border-radius:8px; background:#FFF; box-shadow:0 2px 4px rgba(0,0,0,0.05); margin:0 auto;">';
        s += '<p style="font-size:10px; font-weight:700; color:#707070; text-transform:uppercase; margin:0 0 15px 0; letter-spacing:1px;">Style Clash: GB Floor vs LD Ceiling</p>';
        s += '<div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:11px; font-weight:700;">';
        s += '<span style="color:' + CLARK_PALETTE.navy + ';">' + pName + ' (GB)</span>';
        s += '<span style="color:' + CLARK_PALETTE.slate + ';">' + bName + ' (LD)</span></div>';
        s += '<div style="height:14px; background:' + CLARK_PALETTE.grey + '; border-radius:7px; position:relative; overflow:hidden; margin-bottom:15px;">';
        s += '<div style="position:absolute; left:0; height:100%; width:' + pGB + '%; background:' + CLARK_PALETTE.navy + '; transition:width 0.4s ease;"></div>';
        s += '<div style="position:absolute; right:0; height:100%; width:' + bLD + '%; background:' + CLARK_PALETTE.slate + '; transition:width 0.4s ease;"></div>';
        if (isVolatile) {
            s += '<div style="position:absolute; left:' + overlapLeft + '%; right:' + overlapRight + '%; height:100%; background:' + CLARK_PALETTE.amber + '; opacity:0.4;"></div>';
        }
        s += '<div style="position:absolute; left:' + leagueGB + '%; width:1px; height:100%; background:' + CLARK_PALETTE.white + '; opacity:0.6;"></div>';
        s += '</div>';
        var alertBg = isVolatile ? '#FFF9E6' : '#FAFAFA';
        var alertBorder = isVolatile ? CLARK_PALETTE.amber : '#E0E0E0';
        s += '<div style="padding:10px; background:' + alertBg + '; border-radius:4px; border:1px solid ' + alertBorder + ';">';
        s += '<p style="font-size:11px; color:' + CLARK_PALETTE.slate + '; margin:0; line-height:1.4;">';
        if (isVolatile) {
            s += '<b style="color:' + CLARK_PALETTE.amber + ';">VOLATILITY ALERT:</b> Combined non-flyball rate of ' + combined.toFixed(1) + '%. Expect high-velocity contact.';
        } else {
            s += '<b>STABLE MATCHUP:</b> Low stylistic overlap (' + combined.toFixed(1) + '%). Advantage favors defensive positioning.';
        }
        s += '</p></div></div>';
        return s;
    }
};

var SituationalDiamond = {
    render: function(batter, thresholds) {
        if (!thresholds) thresholds = { advantage: 0.050, disadvantage: -0.050, smallSample: 10 };
        var sit = batter ? batter.situational : null;
        var emptyOps = parseFloat((sit && sit.bases_empty ? sit.bases_empty.ops : null) || (batter && batter.season ? batter.season.ops : null) || 0);

        var getBase = function(data) {
            if (!data) return { color: CLARK_PALETTE.slate, dashed: false, delta: 0 };
            var delta = parseFloat(data.ops || 0) - emptyOps;
            var color = CLARK_PALETTE.slate;
            if (delta >= thresholds.advantage) color = CLARK_PALETTE.green;
            else if (delta <= thresholds.disadvantage) color = CLARK_PALETTE.rust;
            return { color: color, dashed: (data.pa || 0) < thresholds.smallSample, delta: delta };
        };

        var b2 = getBase(sit ? sit.risp : null);
        var b3 = getBase(sit ? sit.bases_loaded : null);
        var bName = (batter && batter.name) || 'Select Batter';

        var s = '<div style="font-family:\'IBM Plex Sans\',sans-serif; width:100%; max-width:260px; text-align:center; padding:20px; border:1px solid #E0E0E0; border-radius:8px; background:#FFF; box-shadow:0 2px 4px rgba(0,0,0,0.05); margin:0 auto;">';
        s += '<p style="font-size:10px; font-weight:700; color:#707070; text-transform:uppercase; margin:0 0 15px 0; letter-spacing:1px;">Situational Edge (vs Baseline)</p>';
        s += '<svg viewBox="0 0 100 100" width="140" style="margin:0 auto; display:block;">';
        s += '<path d="M50,90 L90,50 L50,10 L10,50 Z" fill="none" stroke="' + CLARK_PALETTE.navy + '" stroke-width="1" opacity="0.3"/>';
        s += '<path d="M47,90 L53,90 L53,86 L50,83 L47,86 Z" fill="' + CLARK_PALETTE.slate + '" opacity="0.6"/>';
        s += '<rect x="45" y="5" width="10" height="10" transform="rotate(45 50 10)" fill="' + b2.color + '" stroke="' + CLARK_PALETTE.white + '" stroke-width="1"' + (b2.dashed ? ' style="stroke-dasharray:2,1;"' : '') + '/>';
        s += '<rect x="5" y="45" width="10" height="10" transform="rotate(45 10 50)" fill="' + b3.color + '" stroke="' + CLARK_PALETTE.white + '" stroke-width="1"' + (b3.dashed ? ' style="stroke-dasharray:2,1;"' : '') + '/>';
        s += '</svg>';
        s += '<div style="margin-top:12px; font-size:15px; font-weight:700; color:' + CLARK_PALETTE.navy + ';">' + bName + '</div>';
        s += '<div style="display:flex; justify-content:center; gap:12px; margin-top:4px; font-size:10px; font-weight:700;">';
        s += '<span style="color:' + b2.color + ';">2B: ' + EngineUtils.formatStat(b2.delta) + '</span>';
        s += '<span style="color:' + b3.color + ';">3B: ' + EngineUtils.formatStat(b3.delta) + '</span>';
        s += '</div></div>';
        return s;
    }
};

var MatchupSimulator = {
    getNote: function(pitcher, batter) {
        if (!pitcher || !batter) return 'Select a matchup to generate scouting intelligence.';
        var pK = (pitcher.season ? pitcher.season.k_pct : null) || pitcher.k_pct || 0;
        var bK = (batter.season ? batter.season.k_pct : null) || 0;
        var bvp = batter.historical ? batter.historical.bvp_vs_starter : null;
        var vsHand = batter.historical ? batter.historical.vs_hand : null;

        if (bvp && bvp.pa >= 10 && parseFloat(bvp.avg) >= 0.300) {
            return '<b>BvP ADVANTAGE:</b> ' + batter.name + ' is ' + bvp.avg + ' in ' + bvp.pa + ' PA against ' + pitcher.name + '. History favors the hitter.';
        }
        if (vsHand && parseFloat(vsHand.ops) > 0.850) {
            return '<b>PLATOON MISMATCH:</b> ' + batter.name + ' owns ' + vsHand.hand + '-handed pitching (' + vsHand.ops + ' OPS). Clear situational edge.';
        }
        if (bK < 15 && pK < 18) {
            return '<b>CONTACT FOCUS:</b> ' + batter.name + "'s elite " + bK + '% K-rate negates ' + pitcher.name + "'s reliance on contact. Expect a high-velocity duel.";
        }
        return '<b>NEUTRAL MATCHUP:</b> No significant historical or situational edge detected. Advantage favors defensive positioning.';
    }
};

var SelectorBuilder = {
    roleOrder: { 'SP': 0, 'CL': 1, 'SU': 2, 'MR': 3 },
    roleLabelMap: { 'SP': 'Starter', 'CL': 'Closer', 'SU': 'Setup', 'MR': 'Middle Relief' },

    build: function(data) {
        var self = this;
        var container = document.createElement('div');
        container.setAttribute('style', 'font-family:"IBM Plex Sans",sans-serif; display:flex; flex-wrap:wrap; gap:12px; justify-content:center; align-items:center; margin:0 0 20px 0; padding:16px; background:#F4F4F4; border-radius:8px;');

        var stlBatters = (data.roster && data.roster.cardinals && data.roster.cardinals.batters) || [];
        var oppBatters = (data.roster && data.roster.opponent && data.roster.opponent.batters) || [];
        var stlPitchers = (data.roster && data.roster.cardinals && data.roster.cardinals.pitchers) || [];
        var oppPitchers = (data.roster && data.roster.opponent && data.roster.opponent.pitchers) || [];
        var stlStarter = data.starters ? data.starters.cardinals : null;
        var oppStarter = data.starters ? data.starters.opponent : null;
        var oppName = (data.meta && data.meta.opponent_abbrev) || 'OPP';
        var stlName = 'STL';

        var selectStyle = 'font-size:13px; font-family:"IBM Plex Sans",sans-serif; padding:6px 10px; border:1px solid #E0E0E0; border-radius:4px; background:#FFF; color:' + CLARK_PALETTE.navy + '; min-width:160px; max-width:100%;';
        var labelStyle = 'font-size:11px; font-weight:700; color:' + CLARK_PALETTE.navy + '; text-transform:uppercase; letter-spacing:1px;';

        var pLabel = document.createElement('label');
        pLabel.setAttribute('style', labelStyle);
        pLabel.textContent = 'Pitcher';
        var pSelect = document.createElement('select');
        pSelect.id = 'pitcher-select';
        pSelect.setAttribute('style', selectStyle);

        var addPitcherGroup = function(label, pitchers, starter) {
            if (pitchers.length === 0 && !starter) return;
            var group = document.createElement('optgroup');
            group.label = label;
            var sorted = pitchers.slice().sort(function(a, b) {
                var ra = self.roleOrder[a.role] !== undefined ? self.roleOrder[a.role] : 9;
                var rb = self.roleOrder[b.role] !== undefined ? self.roleOrder[b.role] : 9;
                return ra - rb;
            });
            for (var i = 0; i < sorted.length; i++) {
                var p = sorted[i];
                var opt = document.createElement('option');
                opt.value = p.person_id;
                var roleTag = self.roleLabelMap[p.role] || p.role || '';
                opt.textContent = p.name + ' (' + roleTag + ')';
                if (starter && p.person_id === starter.person_id) opt.selected = true;
                group.appendChild(opt);
            }
            pSelect.appendChild(group);
        };

        addPitcherGroup(oppName + ' Pitching', oppPitchers, oppStarter);
        addPitcherGroup(stlName + ' Pitching', stlPitchers, stlStarter);

        var bLabel = document.createElement('label');
        bLabel.setAttribute('style', labelStyle);
        bLabel.textContent = 'Batter';
        var bSelect = document.createElement('select');
        bSelect.id = 'batter-select';
        bSelect.setAttribute('style', selectStyle);

        var addBatterGroup = function(label, batters) {
            if (batters.length === 0) return;
            var group = document.createElement('optgroup');
            group.label = label;
            var lineup = [];
            var bench = [];
            for (var i = 0; i < batters.length; i++) {
                if (batters[i].in_lineup) lineup.push(batters[i]);
                else bench.push(batters[i]);
            }
            lineup.sort(function(a, b) { return (a.batting_order || 99) - (b.batting_order || 99); });
            bench.sort(function(a, b) { return (a.name || '').localeCompare(b.name || ''); });

            for (var j = 0; j < lineup.length; j++) {
                var b = lineup[j];
                var opt = document.createElement('option');
                opt.value = b.person_id;
                opt.textContent = '#' + (b.batting_order || (j + 1)) + ' ' + b.name + ' (' + (b.position || '') + ' ' + (b.bats || '') + ')';
                if (j === 0) opt.selected = true;
                group.appendChild(opt);
            }
            if (bench.length > 0) {
                var sep = document.createElement('option');
                sep.disabled = true;
                sep.textContent = '--- Bench ---';
                group.appendChild(sep);
                for (var k = 0; k < bench.length; k++) {
                    var bch = bench[k];
                    var bOpt = document.createElement('option');
                    bOpt.value = bch.person_id;
                    bOpt.textContent = bch.name + ' (' + (bch.position || '') + ' ' + (bch.bats || '') + ')';
                    group.appendChild(bOpt);
                }
            }
            bSelect.appendChild(group);
        };

        addBatterGroup(stlName + ' Batting', stlBatters);
        addBatterGroup(oppName + ' Batting', oppBatters);

        container.appendChild(pLabel);
        container.appendChild(pSelect);
        var spacer = document.createElement('span');
        spacer.setAttribute('style', 'font-size:11px; color:#707070; font-weight:700;');
        spacer.textContent = 'vs';
        container.appendChild(spacer);
        container.appendChild(bLabel);
        container.appendChild(bSelect);

        return { container: container, pSelect: pSelect, bSelect: bSelect };
    }
};

window.init700ClarkEngine = function(data) {
    if (!data) return;

    var gaugeTarget = document.getElementById('fireman-gauge-target');
    var collisionTarget = document.getElementById('collision-meter-target');
    var diamondTarget = document.getElementById('situational-diamond-target');
    var noteTarget = document.getElementById('scouting-note-target');

    if (!gaugeTarget) return;

    var selectors = SelectorBuilder.build(data);
    gaugeTarget.parentNode.insertBefore(selectors.container, gaugeTarget);
    var pSelect = selectors.pSelect;
    var bSelect = selectors.bSelect;

    var allPitchers = [
        data.starters ? data.starters.cardinals : null,
        data.starters ? data.starters.opponent : null
    ].concat(
        (data.roster && data.roster.cardinals && data.roster.cardinals.pitchers) || [],
        (data.roster && data.roster.opponent && data.roster.opponent.pitchers) || []
    ).filter(Boolean);

    var allBatters = [].concat(
        (data.roster && data.roster.cardinals && data.roster.cardinals.batters) || [],
        (data.roster && data.roster.opponent && data.roster.opponent.batters) || []
    );

    var defaultStarter = data.starters ? data.starters.opponent : null;
    var defaultBatter = (data.roster && data.roster.cardinals && data.roster.cardinals.batters) ? data.roster.cardinals.batters[0] : null;

    var updateMatchup = function() {
        var pitcherId = pSelect.value;
        var batterId = bSelect.value;
        var p, b, i;

        for (i = 0; i < allPitchers.length; i++) {
            if (allPitchers[i].person_id == pitcherId) { p = allPitchers[i]; break; }
        }
        if (!p) p = defaultStarter;

        for (i = 0; i < allBatters.length; i++) {
            if (allBatters[i].person_id == batterId) { b = allBatters[i]; break; }
        }
        if (!b) b = defaultBatter;

        var leagueIR = (data.league_benchmarks && data.league_benchmarks.avg_ir_strand_pct) || 72;
        var leagueGB = (data.league_benchmarks && data.league_benchmarks.avg_gb_pct) || 43.2;
        var volThreshold = (data.thresholds && data.thresholds.collision_meter) ? data.thresholds.collision_meter.volatility_threshold : 85;
        var sitThresholds = {};
        if (data.thresholds && data.thresholds.situational_diamond) {
            sitThresholds.advantage = data.thresholds.situational_diamond.advantage_delta;
            sitThresholds.disadvantage = data.thresholds.situational_diamond.disadvantage_delta;
        } else {
            sitThresholds.advantage = 0.050;
            sitThresholds.disadvantage = -0.050;
        }
        sitThresholds.smallSample = (data.thresholds && data.thresholds.small_sample_warning) || 10;

        if (gaugeTarget) gaugeTarget.innerHTML = FiremanGauge.render(p, leagueIR);
        if (collisionTarget) collisionTarget.innerHTML = CollisionMeter.render(p, b, leagueGB, volThreshold);
        if (diamondTarget) diamondTarget.innerHTML = SituationalDiamond.render(b, sitThresholds);
        if (noteTarget) {
            noteTarget.innerHTML = '<div style="font-family:\'IBM Plex Sans\',sans-serif; padding:12px 20px; font-size:12px; color:' + CLARK_PALETTE.slate + '; font-style:italic; line-height:1.5; text-align:center;">' + MatchupSimulator.getNote(p, b) + '</div>';
        }
    };

    pSelect.addEventListener('change', updateMatchup);
    bSelect.addEventListener('change', updateMatchup);

    updateMatchup();
};
