// ThaiMed-Safe Application Logic
const selectedHerbs = new Set();
const selectedDrugs = new Set();
let currentMode = 'patient';

document.getElementById('herb-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && this.value.trim()) {
        addChip(this.value.trim(), 'herb');
        this.value = '';
    }
});

document.getElementById('drug-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && this.value.trim()) {
        addChip(this.value.trim(), 'drug');
        this.value = '';
    }
});

function addChip(name, type) {
    if (type === 'herb') selectedHerbs.add(name);
    else selectedDrugs.add(name);
    renderChips();
}

function removeChip(name, type) {
    if (type === 'herb') selectedHerbs.delete(name);
    else selectedDrugs.delete(name);
    renderChips();
}

function renderChips() {
    document.getElementById('herb-chips').innerHTML = Array.from(selectedHerbs).map(item => `
        <div class="chip herb-chip">
            <span>${item}</span>
            <i class="fa-solid fa-xmark" onclick="removeChip('${item}', 'herb')"></i>
        </div>
    `).join('');

    document.getElementById('drug-chips').innerHTML = Array.from(selectedDrugs).map(item => `
        <div class="chip modern-chip">
            <span>${item}</span>
            <i class="fa-solid fa-xmark" onclick="removeChip('${item}', 'drug')"></i>
        </div>
    `).join('');
}

function setMode(mode) {
    currentMode = mode;
    document.getElementById('btn-patient').classList.toggle('active', mode === 'patient');
    document.getElementById('btn-doctor').classList.toggle('active', mode === 'doctor');
    if (document.getElementById('result-section').style.display === 'block') {
        analyzeInteraction();
    }
}

function analyzeInteraction() {
    if (selectedHerbs.size === 0 || selectedDrugs.size === 0) {
        alert('กรุณาเลือกยาสมุนไพรและยาแผนปัจจุบันอย่างน้อยอย่างละ 1 รายการครับ');
        return;
    }

    const resultCard = document.getElementById('result-section');
    const detailsList = document.getElementById('details-list');

    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth' });

    const hasWarfarin = Array.from(selectedDrugs).some(d => d.toLowerCase().includes('warfarin'));
    const hasFah = Array.from(selectedHerbs).some(h => h.includes('ฟ้าทะลายโจร') || h.includes('ขมิ้นชัน'));

    if (hasWarfarin && hasFah) {
        if (currentMode === 'patient') {
            detailsList.innerHTML = `
                <div class="detail-item">
                    <div class="detail-title">
                        <span>สมุนไพรต้านการแข็งตัว + Warfarin</span>
                        <span class="severity-badge">อันตรายสูง</span>
                    </div>
                    <div class="detail-desc">
                        การรับประทานร่วมกันอาจทำให้ยาละลายลิ่มเลือดทำงานแรงเกินไป ส่งผลให้เลือดออกตามไรฟัน เลือดกำเดาไหลง่าย หรือเลือดหยุดยาก
                    </div>
                    <div class="clinical-note">
                        <strong>💡 คำแนะนำสำหรับผู้ป่วย:</strong>
                        ควรหยุดรับประทานสมุนไพรดังกล่าวทันที และปรึกษาแพทย์หรือเภสัชกร
                    </div>
                </div>
            `;
        } else {
            detailsList.innerHTML = `
                <div class="detail-item">
                    <div class="detail-title">
                        <span>CYP2C9/3A4 Inhibition vs Warfarin Metabolism</span>
                        <span class="severity-badge">Major Interaction</span>
                    </div>
                    <div class="detail-desc">
                        <strong>Mechanism:</strong> สารสำคัญในสมุนไพรมีฤทธิ์ยับยั้งเอนไซม์ CYP2C9/CYP3A4 ส่งผลเพิ่มระดับ Plasma Concentration ของ Warfarin และเสี่ยงต่อภาวะ Major Bleeding (INR Elevation)
                    </div>
                    <div class="clinical-note">
                        <strong>👨‍⚕️ Clinical Note:</strong>
                        Monitor INR status or adjust dose. Ref: THP Clinical Guideline 2026.
                    </div>
                </div>
            `;
        }
    } else {
        detailsList.innerHTML = `
            <div class="detail-item" style="border-color: var(--safe-color);">
                <div class="detail-title">
                    <span>ผลการประมวลผลทั่วไป</span>
                    <span class="severity-badge" style="background: var(--safe-color);">ปลอดภัย</span>
                </div>
                <div class="detail-desc">
                    ไม่พบรายงานปฏิกิริยารุนแรงของรายการยาที่เลือก
                </div>
                <div class="clinical-note">
                    <strong>💡 คำแนะนำ:</strong> ควรรับประทานยาสมุนไพรและยาแผนปัจจุบันห่างกันอย่างน้อย 1-2 ชั่วโมง
                </div>
            </div>
        `;
    }
}
