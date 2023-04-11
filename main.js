function data() {
  const fileCat = document.querySelector("#category").files;
  const fileTag = document.querySelector("#tag").files;
  const countFilesCat = fileCat.length;
  const countFilesTag = fileTag.length;

  if (!countFilesCat) {
    alert("Не выбран файл рубрик!");
    return;
  }
  if (!countFilesTag) {
    alert("Не выбран файл меток!");
    return;
  }

  const selectedFileCat = fileCat[0];
  const readerCat = new FileReader();
  const name_category = [];
  const name_category_slug = [];
  readerCat.readAsText(selectedFileCat);
  readerCat.addEventListener("load", (e) => {
    let x2js = new X2JS();
    let xmlText = readerCat.result;
    let jsonObj = x2js.xml_str2json(xmlText);
    let data = x2js.asArray(jsonObj.data.post);
    //console.log(data);
    let json = JSON.stringify(data);
    for (let term in JSON.parse(json)) {
      name_category.push(data[term].TermName);
      name_category_slug.push(data[term].TermSlug);
    }
  });

  const selectedFileTag = fileTag[0];
  const readerTag = new FileReader();
  const name_tag = [];
  const name_org = [];
  const name_tag_slug = [];
  readerTag.readAsText(selectedFileTag);
  readerTag.addEventListener("load", (e) => {
    let x2js = new X2JS();
    let xmlText = readerTag.result;
    let jsonObj = x2js.xml_str2json(xmlText);
    let data = x2js.asArray(jsonObj.data.post);
    for (let term in data) {
      if (data[term].locative !== "") {
        name_tag.push(data[term].locative);
      } else {
        name_tag.push(data[term].TermName);
      }
      name_tag_slug.push(data[term].TermSlug);
      name_org.push(data[term].TermName);
    }
  });

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
