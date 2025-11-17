<template>
    <form action="/din-form-handler" method="POST">

    <!-- Kontakt -->
    <div class="form-grid">
    <div class="form-group">
        <label class="required">Kontaktperson</label>
        <input type="text" name="kontaktperson" required="">
    </div>
    <div class="form-group">
        <label class="required">Telefonnummer</label>
        <input type="tel" name="telefon" required="">
    </div>
    </div>

    <div class="form-group">
    <label class="required">E-mail</label>
    <input type="email" name="email" required="">
    </div>

    <hr style="border:none; border-top:2px solid #eee; margin:40px 0">

    <!-- Transport detaljer -->
    <div class="form-grid">
    <div class="form-group">
        <label class="required">Transportretning</label>
        <div class="option-grid">
        <div class="option-item">
            <input type="radio" name="transport" value="Import" id="import" required="">
            <label for="import">Import</label>
        </div>
        <div class="option-item">
            <input type="radio" name="transport" value="Eksport" id="eksport">
            <label for="eksport">Eksport</label>
        </div>
        <div class="option-item">
            <input type="radio" name="transport" value="One-Way" id="oneway">
            <label for="oneway">One-Way</label>
        </div>
        </div>
    </div>

    <div class="form-group">
        <label class="required">Container størrelse/type</label>
        <div class="option-grid">
        <div class="option-item"><input type="checkbox" name="container" value="20’ DC" id="c20dc"><label for="c20dc">20’ DC</label></div>
        <div class="option-item"><input type="checkbox" name="container" value="20’ HC" id="c20hc"><label for="c20hc">20’ HC</label></div>
        <div class="option-item"><input type="checkbox" name="container" value="40’ DC" id="c40dc"><label for="c40dc">40’ DC</label></div>
        <div class="option-item"><input type="checkbox" name="container" value="40’ HC" id="c40hc"><label for="c40hc">40’ HC</label></div>
        <div class="option-item"><input type="checkbox" name="container" value="40 Reefer" id="reefer"><label for="reefer">40’ Reefer</label></div>
        <div class="option-item"><input type="checkbox" name="container" value="Andet" id="andet"><label for="andet">Andet</label></div>
        </div>
    </div>
    </div>

    <div class="form-grid">
    <div class="form-group">
        <label class="required">Transporttype</label>
        <div class="option-grid">
        <div class="option-item"><input type="checkbox" name="transporttype" value="Chassis" id="chassis"><label for="chassis">Chassis</label></div>
        <div class="option-item"><input type="checkbox" name="transporttype" value="Sidelaster" id="sidelaster"><label for="sidelaster">Sidelaster</label></div>
        <div class="option-item"><input type="checkbox" name="transporttype" value="Genset" id="genset"><label for="genset">Genset</label></div>
        <div class="option-item"><input type="checkbox" name="transporttype" value="TIP Chassis" id="tip"><label for="tip">TIP Chassis</label></div>
        </div>
    </div>

    <div class="form-group">
        <label class="required">Antal containere</label>
        <input type="number" name="antal" min="1" value="1" required="">
    </div>
    </div>

    <div class="form-grid">
    <div class="form-group">
        <label class="required">Rederi</label>
        <select name="rederi" required="">
        <option value="" disabled="" selected="">Vælg rederi</option>
        <option>MSC</option><option>Mærsk</option><option>Hapag</option>
        <option>ONE</option><option>OOCL</option><option>Yang Ming</option>
        <option>Evergreen</option><option>CMA CGM</option><option>Cosco</option>
        <option>Shippers Own</option><option>Andet</option>
        </select>
    </div>

    <div class="form-group">
        <label>Live eller Drop</label>
        <div class="option-grid">
        <div class="option-item"><input type="radio" name="livedrop" value="Live" id="live"><label for="live">Live</label></div>
        <div class="option-item"><input type="radio" name="livedrop" value="Drop" id="drop"><label for="drop">Drop</label></div>
        </div>
    </div>
    </div>

    <hr style="border:none; border-top:2px solid #eee; margin:40px 0">

    <div class="form-group">
    <label class="required">Afhentningssted (adresse + postnr/by)</label>
    <input type="text" name="afhentning" placeholder="F.eks. Industrivej 23, 7000 Fredericia" required="">
    </div>

    <div class="form-group">
    <label class="required">Leveringssted (adresse + postnr/by)</label>
    <input type="text" name="levering" placeholder="F.eks. Havnevej 10, 8000 Aarhus C" required="">
    </div>

    <div class="form-group">
    <label>Indleveringssted (hvis forskelligt fra afhentning)</label>
    <input type="text" name="indlevering">
    </div>

    <div class="form-group">
    <label>Bemærkninger / specielle ønsker</label>
    <textarea name="bemærkninger" placeholder="F.eks. farligt gods (ADR), tidskrav, overvægt, osv."></textarea>
    </div>

    <button type="submit" class="submit-btn">
    Send forespørgsel → Få tilbud inden for 24 timer
    </button>
    </form>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>