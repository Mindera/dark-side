'use strict';

/*jshint -W079 */
var expect = require('chai').expect;

var StarDestroyer = require('../../src/star-destroyer/star-destroyer');
var victim;

describe('Star Destroyer', function () {

    beforeEach(function () {
        var commanderMock = {
            manageFighters: function (fightersOnDeck, fightersInMission, fightersInInspection, fightersInRepair, scrapYard) {
                fightersOnDeck.push({ 'whoAmI': 'a fighter on deck' });
                fightersInMission.put('1', { 'whoAmI': 'a fighter in mission' });
                scrapYard.push({ 'whoAmI': 'a fighter on the scrap yard' });
            }
        };

        var chiefMechanicMock = {
            manageFighters: function (fightersOnDeck, fightersInRepair, fightersInInspection) {
                fightersOnDeck.push({ 'whoAmI': 'another fighter on deck' });
                fightersInRepair.push({ 'whoAmI': 'a fighter in repair' }, 'no wings');
                fightersInInspection.push({ 'whoAmI': 'a fighter in inspection' });
            }
        };

        var deckOfficer = {
            manageFighters: function (fightersOnDeck, fightersInMission) {
                fightersOnDeck.push({ 'whoAmI': 'yet another fighter on deck' });
                fightersInMission.put('2', 'another fighter in mission');
            }
        };

        victim = new StarDestroyer(commanderMock, chiefMechanicMock, deckOfficer);
    });

    it('should get fighters on deck', function () {
        var fightersOnDeck = victim.getFightersOnDeck();
        expect(fightersOnDeck.length).to.equal(3);
    });

    it('should get a fighter', function () {
        var aFighter = victim.getOneFighter();
        var fightersOnDeck = victim.getFightersOnDeck();

        expect(aFighter.whoAmI).to.equal('a fighter on deck');
        expect(fightersOnDeck.length).to.equal(2);
    });

    it('should get undefined when no fighters are available', function () {
        var aFighter = victim.getOneFighter();
        var anotherFighter = victim.getOneFighter();
        var yetAnotherFighter = victim.getOneFighter();
        var fightersOnDeck = victim.getFightersOnDeck();

        expect(fightersOnDeck.length).to.equal(0);
        expect(aFighter.whoAmI).to.equal('a fighter on deck');
        expect(anotherFighter.whoAmI).to.equal('another fighter on deck');
        expect(yetAnotherFighter.whoAmI).to.equal('yet another fighter on deck');
    });

    it('should get scrap yard', function () {
        var scrapYard = victim.getScrapYard();
        expect(scrapYard.length).to.equal(1);
        expect(scrapYard[0].whoAmI).to.equal('a fighter on the scrap yard');
    });

    it('should check if destroyer is combat ready', function () {
        expect(victim.isCombatReady()).to.equal(true);

        // Use all fighters
        victim.getOneFighter();
        victim.getOneFighter();
        victim.getOneFighter();

        expect(victim.isCombatReady()).to.equal(false);
    });

    it('should check if destroyer is not combat ready', function () {
        // Use all fighters
        victim.getOneFighter();
        victim.getOneFighter();
        victim.getOneFighter();

        expect(victim.isCombatReady()).to.equal(false);
    });

    it('should recall a fighter from a fight', function() {
        expect(victim.getFightersOnDeck().length).to.equal(3);
        var fighterForRecall = victim.recallFighter('whoAmI','a fighter in mission');
        expect(fighterForRecall.whoAmI).to.equal('a fighter in mission' );
        expect(victim.getFightersOnDeck().length).to.equal(4);
    });

    it('should return undefined if there is no fighter to recall', function() {
        expect(victim.getFightersOnDeck().length).to.equal(3);
        var fighterForRecall = victim.recallFighter('whoAmI','a fighter in mission');
        expect(fighterForRecall.whoAmI).to.equal('a fighter in mission' );
        expect(victim.getFightersOnDeck().length).to.equal(4);
        // second call
        fighterForRecall = victim.recallFighter('whoAmI','a fighter in mission');
        expect(fighterForRecall).to.equal(undefined);
        expect(victim.getFightersOnDeck().length).to.equal(4);
    });

    it('should put fighter from trash in repair', function() {
        expect(victim.getScrapYard().length).to.equal(1);
        expect(victim.getFightersInRepair().length).to.equal(1);
        var fighterForBusted = victim.putOneFromScrapYardIntoRepair();
        expect(fighterForBusted.whoAmI).to.equal('a fighter on the scrap yard' );
        expect(victim.getScrapYard().length).to.equal(0);
        expect(victim.getFightersInRepair().length).to.equal(2);
    });

    it('should return undefined if there is no fighter in trash ', function() {
        expect(victim.getScrapYard().length).to.equal(1);
        expect(victim.getFightersInRepair().length).to.equal(1);
        var fighterForBusted = victim.putOneFromScrapYardIntoRepair();
        expect(fighterForBusted.whoAmI).to.equal('a fighter on the scrap yard' );
        expect(victim.getScrapYard().length).to.equal(0);
        expect(victim.getFightersInRepair().length).to.equal(2);

        fighterForBusted = victim.putOneFromScrapYardIntoRepair();
        expect(fighterForBusted).to.equal(undefined);
        expect(victim.getScrapYard().length).to.equal(0);
        expect(victim.getFightersInRepair().length).to.equal(2);
    });

    it('should check figth for inspection ', function() {
        expect(victim.getFightersInInspection().length).to.equal(1);
        expect(victim.getFightersInInspection()[0].whoAmI).to.equal('a fighter in inspection');
    });
});