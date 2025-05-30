let tc = localStorage.getItem("tc");
if (tc) document.getElementById("tc").value = tc;

function girisYap() {
  tc = document.getElementById("tc").value;
  localStorage.setItem("tc", tc);
  if (tc === "admin45") {
    document.getElementById("giris").style.display = "none";
    document.getElementById("sonuclar").style.display = "block";
    fetch("/sonuclar").then(res => res.json()).then(goster);
  } else {
    fetch("/kontrol", { method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ tc }) })
      .then(res => res.json()).then(data => {
        if (data.varMi) alert("Zaten oy kullandınız.");
        else {
          document.getElementById("giris").style.display = "none";
          document.getElementById("anket").style.display = "block";
        }
      });
  }
}

function oyVer() {
  let veri = {
    tc,
    tisortModeli: document.getElementById("tisortModeli").value,
    tisortRenk: document.getElementById("tisortRenk").value,
    pantolonRenk: document.getElementById("pantolonRenk").value
  };
  fetch("/oyver", { method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(veri) })
    .then(res => res.json()).then(data => {
      alert("Oy kullandınız!");
      cikisYap();
    });
}

function cikisYap() {
  localStorage.removeItem("tc");
  location.reload();
}

function goster(data) {
  let tablo = "<table border='1'><tr><th>TC</th><th>Tişört</th><th>Renk</th><th>Pantolon</th></tr>";
  data.forEach(x => tablo += `<tr><td>${x.tc}</td><td>${x.tisortModeli}</td><td>${x.tisortRenk}</td><td>${x.pantolonRenk}</td></tr>`);
  tablo += "</table>";
  document.getElementById("tablo").innerHTML = tablo;

  let ctx = document.getElementById("grafik").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["V-Yaka", "Bisiklet Yaka", "Polo Yaka"],
      datasets: [{ label: "Tişört Seçimi", data: [
        data.filter(x=>x.tisortModeli==="V-Yaka").length,
        data.filter(x=>x.tisortModeli==="Bisiklet Yaka").length,
        data.filter(x=>x.tisortModeli==="Polo Yaka").length
      ], backgroundColor: ["red", "blue", "green"] }]
    }
  });
}

function excelAl() {
  alert("Excel aktarımı için admin paneline özel geliştirme eklenecek.");
}
