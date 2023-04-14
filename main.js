const tbodyCat = document.querySelector("tbody.cat-data");
const tbodyTag = document.querySelector("tbody.tag-data");

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

  document.querySelector("div.data").removeAttribute("style");

  let tr = "";

  const selectedFileCat = fileCat[0];
  const readerCat = new FileReader();
  readerCat.readAsText(selectedFileCat);
  readerCat.addEventListener("load", (e) => {
    let x2js = new X2JS();
    let xmlText = readerCat.result;
    let jsonObj = x2js.xml_str2json(xmlText);
    let data = x2js.asArray(jsonObj.data.post);
    let json = JSON.stringify(data);
    for (let term in JSON.parse(json)) {
      tr = document.createElement("tr");
      tbodyCat.append(tr);
      tr.innerHTML = "<td scope='col' widtd='5%'><input class='form-check-input' type='checkbox'></td><td scope='col' widtd='20%'>"+data[term].TermName+"</td><td scope='col' widtd='20%'>"+data[term].locative+"</td><td scope='col' widtd='20%'>"+data[term].TermSlug+"</td>";
    }
  });

  const selectedFileTag = fileTag[0];
  const readerTag = new FileReader();
  readerTag.readAsText(selectedFileTag);
  readerTag.addEventListener("load", (e) => {
    let x2js = new X2JS();
    let xmlText = readerTag.result;
    let jsonObj = x2js.xml_str2json(xmlText);
    let data = x2js.asArray(jsonObj.data.post);
    for (let term in data) {
      tr = document.createElement("tr");
      tbodyTag.append(tr);
      tr.innerHTML = "<td scope='col' widtd='5%'><input class='form-check-input' type='checkbox'></td><td scope='col' widtd='20%'>"+data[term].TermName+"</td><td scope='col' widtd='20%'>"+data[term].locative+"</td><td scope='col' widtd='20%'>"+data[term].TermSlug+"</td>";
    }
  });
}

function generate() {
  let tableCatInfo = Array.prototype.map.call(document.querySelectorAll('.cat-data tr'), function(tr){
    if (tr.querySelector("td:nth-child(1) > input").checked) {
    return Array.prototype.map.call(tr.querySelectorAll('td'), function(td){
      return td.innerHTML;
      });
    }
    });

    let tableTagInfo  = Array.prototype.map.call(document.querySelectorAll('.tag-data tr'), function(tr){
      if (tr.querySelector("td:nth-child(1) > input").checked) {
      return Array.prototype.map.call(tr.querySelectorAll('td'), function(td){
          return td.innerHTML;
        });
      }
      });
  
    const name_category = [];
    const name_category_slug = [];
    for (let tmc in tableCatInfo) {
      if (tableCatInfo[tmc] !== undefined) {
      name_category.push(String(tableCatInfo[tmc][1]));
      name_category_slug.push(tableCatInfo[tmc][3]);
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
