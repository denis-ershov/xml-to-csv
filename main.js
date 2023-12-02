const tbodyRub = document.querySelector("tbody.rub-data");
const tbodyTag = document.querySelector("tbody.tag-data");
const checkCat = document.querySelector("#check-category");

if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  document.querySelector("html").setAttribute("data-bs-theme", "dark");
  document.querySelector(".dn").checked = true;
}

document.querySelector(".dn").addEventListener("click", () => {
  document.querySelector(".dn").toggleAttribute("checked");
  document.querySelector("html").toggleAttribute("data-bs-theme", "dark");
  if (document.querySelector("html").getAttribute("data-bs-theme", "dark")) {
    document.querySelector("html").removeAttribute("data-bs-theme");
  } else {
    document.querySelector("html").setAttribute("data-bs-theme", "dark");
  }
});

if (!checkCat.checked) {
  document.querySelector("#category").disabled = true;
}

checkCat.addEventListener("click", () => {
  document.querySelector("#category").toggleAttribute("disabled");
});

function data() {
  const fileCat = document.querySelector("#category").files;
  const fileRub = document.querySelector("#rubric").files;
  const fileTag = document.querySelector("#tag").files;
  const countFilesCat = fileCat.length;
  const countFilesRub = fileRub.length;
  const countFilesTag = fileTag.length;

  if (!countFilesCat && checkCat.checked) {
    alert("Не выбран файл категорий!");
    return;
  }
  if (!countFilesRub) {
    alert("Не выбран файл рубрик!");
    return;
  }
  if (!countFilesTag) {
    alert("Не выбран файл меток!");
    return;
  }

  document.querySelector("div.data").removeAttribute("style");

  let tr = "";

  const selectedFileRub = fileRub[0];
  const readerRub = new FileReader();
  readerRub.readAsText(selectedFileRub);
  readerRub.addEventListener("load", (e) => {
    let x2jsRub = new X2JS();
    let xmlTextRub = readerRub.result;
    let jsonObjRub = x2jsRub.xml_str2json(xmlTextRub);
    let dataRub = x2jsRub.asArray(jsonObjRub.data.post);
    let jsonRub = JSON.stringify(dataRub);

    if (countFilesCat && checkCat.checked) {
      const selectedFileCat = fileCat[0];
      const readerCat = new FileReader();
      readerCat.readAsText(selectedFileCat);
      readerCat.addEventListener("load", (e) => {
        let x2jsCat = new X2JS();
        let xmlTextCat = readerCat.result;
        let jsonObjCat = x2jsCat.xml_str2json(xmlTextCat);
        let dataCat = x2jsCat.asArray(jsonObjCat.data.post);
        let jsonCat = JSON.stringify(dataCat);

        for (let termRub in JSON.parse(jsonRub)) {
          if (jsonCat.includes(dataRub[termRub].TermName)) {
            tr = document.createElement("tr");
            tbodyRub.append(tr);
            tr.innerHTML =
              "<td scope='col' widtd='5%'><input class='form-check-input' type='checkbox' checked></td><td scope='col' widtd='20%'>" +
              dataRub[termRub].TermName +
              "</td><td scope='col' widtd='20%'>" +
              dataRub[termRub].locative +
              "</td><td scope='col' widtd='20%'>" +
              dataRub[termRub].TermSlug +
              "</td>";
          } else {
            tr = document.createElement("tr");
            tbodyRub.append(tr);
            tr.innerHTML =
              "<td scope='col' widtd='5%'><input class='form-check-input' type='checkbox'></td><td scope='col' widtd='20%'>" +
              dataRub[termRub].TermName +
              "</td><td scope='col' widtd='20%'>" +
              dataRub[termRub].locative +
              "</td><td scope='col' widtd='20%'>" +
              dataRub[termRub].TermSlug +
              "</td>";
          }
        }
      });
    }
  });

  const selectedFileTag = fileTag[0];
  const readerTag = new FileReader();
  readerTag.readAsText(selectedFileTag);
  readerTag.addEventListener("load", (e) => {
    let x2jsTag = new X2JS();
    let xmlTextTag = readerTag.result;
    let jsonObjTag = x2jsTag.xml_str2json(xmlTextTag);
    let dataTag = x2jsTag.asArray(jsonObjTag.data.post);
    let jsonTag = JSON.stringify(dataTag);

    if (countFilesCat && checkCat.checked) {
      const selectedFileCat = fileCat[0];
      const readerCat = new FileReader();
      readerCat.readAsText(selectedFileCat);
      readerCat.addEventListener("load", (e) => {
        let x2jsCat = new X2JS();
        let xmlTextCat = readerCat.result;
        let jsonObjCat = x2jsCat.xml_str2json(xmlTextCat);
        let dataCat = x2jsCat.asArray(jsonObjCat.data.post);
        let jsonCat = JSON.stringify(dataCat);

        for (let termTag in JSON.parse(jsonTag)) {
          if (jsonCat.includes(dataTag[termTag].TermName)) {
            tr = document.createElement("tr");
            tbodyTag.append(tr);
            tr.innerHTML =
              "<td scope='col' widtd='5%'><input class='form-check-input' type='checkbox' checked></td><td scope='col' widtd='20%'>" +
              dataTag[termTag].TermName +
              "</td><td scope='col' widtd='20%'>" +
              dataTag[termTag].locative +
              "</td><td scope='col' widtd='20%'>" +
              dataTag[termTag].TermSlug +
              "</td>";
          } else {
            tr = document.createElement("tr");
            tbodyTag.append(tr);
            tr.innerHTML =
              "<td scope='col' widtd='5%'><input class='form-check-input' type='checkbox'></td><td scope='col' widtd='20%'>" +
              dataTag[termTag].TermName +
              "</td><td scope='col' widtd='20%'>" +
              dataTag[termTag].locative +
              "</td><td scope='col' widtd='20%'>" +
              dataTag[termTag].TermSlug +
              "</td>";
          }
        }
      });
    }
  });
}

function generate() {
  let tableRubInfo = Array.prototype.map.call(
    document.querySelectorAll(".rub-data tr"),
    function (tr) {
      if (tr.querySelector("td:nth-child(1) > input").checked) {
        return Array.prototype.map.call(
          tr.querySelectorAll("td"),
          function (td) {
            return td.innerHTML;
          }
        );
      }
    }
  );

  let tableTagInfo = Array.prototype.map.call(
    document.querySelectorAll(".tag-data tr"),
    function (tr) {
      if (tr.querySelector("td:nth-child(1) > input").checked) {
        return Array.prototype.map.call(
          tr.querySelectorAll("td"),
          function (td) {
            return td.innerHTML;
          }
        );
      }
    }
  );

  const name_category = [];
  const name_category_slug = [];
  for (let tmc in tableRubInfo) {
    if (tableRubInfo[tmc] !== undefined) {
      name_category.push(String(tableRubInfo[tmc][1]));
      name_category_slug.push(tableRubInfo[tmc][3]);
    }
  }

  const name_tag = [];
  const name_org = [];
  const name_tag_slug = [];
  for (let tmt in tableTagInfo) {
    if (tableTagInfo[tmt] !== undefined) {
      if (tableTagInfo[tmt][2] !== "") {
        name_tag.push(tableTagInfo[tmt][2]);
      } else {
        name_tag.push(tableTagInfo[tmt][1]);
      }
      name_tag_slug.push(tableTagInfo[tmt][3]);
      name_org.push(tableTagInfo[tmt][1]);
    }
  }

  setTimeout(() => {
    let crossName = d3.cross(name_category, name_tag);
    let crossSlug = d3.cross(name_category_slug, name_tag_slug);
    let crossNameOrg = d3.cross(name_category, name_org);

    let nameCsv = [];

    for (let keyName in crossName) {
      nameCsv.push(crossName[keyName][0] + " " + crossName[keyName][1]);
    }

    let slugCsv = [];

    for (let keySlug in crossSlug) {
      slugCsv.push([crossSlug[keySlug][0] + "-" + crossSlug[keySlug][1]]);
    }

    let newData = [];

    for (let kn in nameCsv) {
      newData[kn] = [];
      for (let ks = 0; ks < 1; ks++) {
        newData[kn].push(
          nameCsv[kn],
          slugCsv[kn].toString(),
          crossName[kn][0],
          crossNameOrg[kn][1]
        );
      }
    }
    saveCSV(newData);
  }, 2000);

  function saveCSV(arr) {
    var csv = "";
    arr.forEach(function (row) {
      csv += row.join(";");
      csv += "\n";
    });

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = "import_map.csv";
    hiddenElement.click();
  }
}
