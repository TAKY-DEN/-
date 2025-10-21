const c1SentencesData = [
    { english: "The epistemological implications of quantum mechanics have fundamentally challenged our understanding of reality and causality", arabic: "الآثار الإبستيمولوجية لميكانيكا الكم طعنت بشكل أساسي في فهمنا للواقع والسببية", pronunciation: "ذي إبيستيمولوجيكال إمبلكيشنز أوف كوانتم ميكانيكس هاف فاندامنتالي تشالنجد أور أندرستاندينغ أوف رياليتاي أند كوزاليتي" },
    { english: "Postmodern philosophers argue that the notion of a unified subject is merely a linguistic construct devoid of ontological reality", arabic: "يجادل الفلاسفة ما بعد الحداثيون بأن فكرة الذات الموحدة مجرد بناء لغوي خالٍ من الواقع الأنطولوجي", pronunciation: "بوست مودرن فيلوسوفيرز أرجيو ذات ذي نوشن أوف أ يونيفايد سبجيكت إز ميرلي أ لينجويستيك كونستراكت ديفويد أوف أونتولوجيكال رياليتاي" },
    { english: "The dialectical relationship between thesis and antithesis inevitably culminates in a synthesis that transcends both original propositions", arabic: "العلاقة الجدلية بين الأطروحة والنقيض تنتهي حتماً بتركيب يتجاوز كلا الافتراضين الأصليين", pronunciation: "ذي دايلكتيكال ريليشنشيب بتوين ثيسيس أند أنتيثيسيس إنيفيتيبلي كالمنيتس إن أ سينثيسيس ذات ترانسيندز بوث أوريجينال بروبوزيشنز" },
    { english: "Hermeneutic analysis reveals that textual meaning is not inherent but rather constructed through the interpretive process of the reader", arabic: "يكشف التحليل الهرمينوطيقي أن معنى النص ليس متأصلاً بل يتم بناؤه من خلال عملية تفسير القارئ", pronunciation: "هيرمينوتيك أناليسيس ريفيلز ذات تكستشوال مينينغ إز نوت إنهرنت بت راذر كونستركتد ثرو ذي إنتربريتيف بروسيس أوف ذي ريدر" },
    { english: "The phenomenological approach emphasizes the primacy of subjective experience and the intentionality of consciousness in constituting reality", arabic: "يؤكد المنهج الفينومينولوجي على أولوية التجربة الذاتية وقصدية الوعي في تشكيل الواقع", pronunciation: "ذي فينومينولوجيكال أبروتش إمفاسايزز ذي برايمسي أوف سبجيكتيف إكسبيرينس أند ذي إنتنشناليتي أوف كونشيسنس إن كونستيتيوتنج رياليتاي" },
    { english: "Contemporary epistemology grapples with the paradox that knowledge claims are simultaneously contingent and universal in scope", arabic: "تتعامل الإبستيمولوجيا المعاصرة مع المفارقة بأن ادعاءات المعرفة عرضية وعالمية في الوقت ذاته", pronunciation: "كونتيمبوراري إبيستيمولوجي جرابلز ويث ذي بارادوكس ذات نوليدج كليمز آر سايمالتينيوسلي كونتينجنت أند يونيفيرسال إن سكوب" },
    { english: "The axiomatization of formal logic has enabled philosophers to examine the structural properties of reasoning with unprecedented rigor", arabic: "قد مكّن بديهيات المنطق الرسمي الفلاسفة من فحص الخصائص الهيكلية للتفكير بدقة لم يسبق لها مثيل", pronunciation: "ذي أكسيوماتيزيشن أوف فورمال لوجيك هاز إنيبلد فيلوسوفيرز تو إكزامين ذي ستركتشرال بروبرتيز أوف ريزونينغ ويث أنبريسيدنتد ريغور" },
    { english: "Inductive reasoning, while pragmatically valuable, cannot logically guarantee the universality of conclusions drawn from particular instances", arabic: "المنطق الاستقرائي، رغم قيمته العملية، لا يمكن أن يضمن منطقياً عالمية الاستنتاجات المستخلصة من حالات معينة", pronunciation: "إندكتيف ريزونينغ، وايل براغماتيكالي فاليوابل، كانوت لوجيكالي جارانتي ذي يونيفيرساليتي أوف كونكلوجنز درون فروم بارتيكيولار إنستانسيز" },
    { english: "The ambiguity inherent in natural language necessitates the development of formal symbolic systems to achieve precise philosophical discourse", arabic: "الغموض المتأصل في اللغة الطبيعية يستلزم تطوير أنظمة رمزية رسمية لتحقيق خطاب فلسفي دقيق", pronunciation: "ذي أمبيجويتي إنهرنت إن ناتشورال لانجويج نيسيسيتيتس ذي ديفيلوبمنت أوف فورمال سيمبوليك سيستمز تو أتشيف بريسايز فيلوسوفيكال ديسكورس" },
    { english: "Pragmatism, as a philosophical doctrine, rejects abstract metaphysical speculation in favor of practical consequences and empirical verification", arabic: "البراغماتية، كمذهب فلسفي، ترفض التكهنات الميتافيزيقية المجردة لصالح النتائج العملية والتحقق التجريبي", pronunciation: "براغماتيزم، أز أ فيلوسوفيكال دوكترين، ريجيكتس أبستراكت ميتافيزيكال سبيكيوليشن إن فيفور أوف براكتيكال كونسي كوينسيز أند إمبيريكال فيريفيكيشن" },
];

// Load sentences into table
function loadC1Sentences() {
    console.log("loadC1Sentences function called.");
    console.log("c1SentencesData:", c1SentencesData);
    const tableBody = document.getElementById("sentencesTable");
    tableBody.innerHTML = "";
    console.log("tableBody cleared.");
    
    c1SentencesData.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${item.english}</strong></td>
            <td>${item.arabic}</td>
            <td>${item.pronunciation || "---"}</td>
            <td><button class="save-btn" onclick="window.progressSystem.toggleSave(\'c1_sentences_${index}\', this.closest(\'tr\'), this)">⭕ حفظ</button></td>
        `;
        tableBody.appendChild(row);
        console.log(`Row ${index} appended.`);
    });

    // Update progress
    // Update progress only if progressSystem is available
    if (typeof window.progressSystem !== "undefined" && window.progressSystem) {
        console.log("progressSystem is available.");
        window.progressSystem.updateProgress("sentences", "c1");
    }
}

// Load on page load
document.addEventListener("DOMContentLoaded", function() {
    loadC1Sentences();
    // Restore saved items and update progress only if progressSystem is available
    if (typeof window.progressSystem !== "undefined" && window.progressSystem) {
        console.log("progressSystem is available.");
        window.progressSystem.restoreSavedItems("sentences", "c1");
        window.progressSystem.updateProgress("sentences", "c1");
    }
});

