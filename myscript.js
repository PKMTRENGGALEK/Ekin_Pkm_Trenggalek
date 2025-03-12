function loadContent(page, element) {
  fetch(page)
    .then((response) => {
      if (!response.ok) throw new Error("Halaman tidak ditemukan");
      return response.text();
    })
    .then((html) => {
      document.getElementById("content").innerHTML = html;

      // Mengatur ulang kelas 'active' pada menu sidebar
      let menuItems = document.querySelectorAll(".sidebar a, .navbar-nav a");
      menuItems.forEach((item) => item.classList.remove("active"));
      if (element) element.classList.add("active");
    })
    .catch((error) => console.error("Error loading page:", error));
}
$(document).ready(function () {
  $(".select2").select2({
    theme: "bootstrap4",
    width: "100%",
    allowClear: true,
  });
});
// tampildata
$(document).ready(function () {
  let table = $("#data-table").DataTable({
    responsive: true,
    autoWidth: false,
    lengthMenu: [5, 10, 25, 50],
    pageLength: 10,
    columnDefs: [
      { width: "25%", targets: 0 }, // Nama
      { width: "15%", targets: 1 }, // Tahun
      { width: "15%", targets: 2 }, // Bulan
      { width: "30%", targets: 3 }, // File]
    ],
  });

  function fetchData() {
    fetch(
      "https://script.google.com/macros/s/AKfycbxsue6pFrEQW_CoBIJUZ2bIfS03OGJzn-GJof5vMg91wmh_PCdsEg408uEzLPp4_yFmVw/exec"
    )
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("Data tidak valid");
          return;
        }
        updateTable(data);
      })
      .catch((error) => console.error("Gagal mengambil data:", error));
  }

  function updateTable(data) {
    table.clear();

    let formattedData = data.map((row) => {
      let fileLink = "-";
      if (row.File_ekin && row.File_ekin.includes("drive.google.com")) {
        let fileId = row.File_ekin.match(/d\/(.*?)(\/|$)/);
        if (fileId) {
          let downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId[1]}`;
          fileLink = `
              <a href="${row.File_ekin}" target="_blank" class="btn btn-sm btn-primary text-center">Lihat File</a>
              <a href="${downloadUrl}" class="btn btn-sm btn-success ms-1 text-center">
                  <i class="bi bi-download"></i> Download
              </a>
          `;
        }
      }

      return [row.Nama || "-", row.Tahun || "-", row.Bulan || "-", fileLink];
    });

    table.rows.add(formattedData).draw();
    $("#table-container").show();
    console.log("Tabel berhasil diperbarui!");
  }

  $("#search-nama, #search-tahun, #search-bulan").on("keyup", function () {
    table.search(this.value).draw();
  });

  fetchData();
});

// paging
function fadeInContent() {
  changeContent("home", document.querySelector(".sidebar a.active"));
}

function changeContent(page, element) {
  let pages = document.querySelectorAll(".page");
  pages.forEach((p) => {
    p.classList.remove("active");
    p.style.opacity = 0;
  });
  let newPage = document.getElementById(page);
  newPage.classList.add("active");
  setTimeout(() => {
    newPage.style.opacity = 1;
  }, 50);

  let menuItems = document.querySelectorAll(".sidebar a");
  menuItems.forEach((item) => item.classList.remove("active"));
  element.classList.add("active");
}
// ambilnama
$(document).ready(function () {
  $(".select2").select2({
    theme: "bootstrap4",
    width: "100%",
    allowClear: true,
  });

  const namaSelect = $("#nama");
  const nipInput = $("#nip");
  const tahunSelect = $("#tahun");

  // Mengisi dropdown tahun
  const currentYear = new Date().getFullYear();
  tahunSelect.empty().append('<option value="">-- Pilih Tahun --</option>'); // Tambahkan opsi default
  for (let year = 2024; year <= currentYear; year++) {
    tahunSelect.append(new Option(year, year));
  }
  tahunSelect.val("").trigger("change"); // Jangan otomatis pilih tahun terbaru

  // Ambil data dari API
  fetch(
    "https://script.google.com/macros/s/AKfycbwUCcZNS9AaFEhzLNvF7Hb1dcoPXPguYMaUnQmvzjhnUWvgSP5CiFh67BswzdULqmZt/exec"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Data dari API:", data);
      if (Array.isArray(data) && data.length > 0) {
        namaSelect.empty().append('<option value="">-- Pilih Nama --</option>');
        data.forEach((item) => {
          let nama = item.NAMA || item.nama;
          let nip = item.NIP || item.nip;
          if (nama && nip) {
            let option = new Option(nama, nama, false, false); // Nama sebagai value
            option.dataset.nip = nip; // Simpan NIP dalam dataset
            namaSelect.append(option);
          }
        });
        namaSelect.trigger("change");
      } else {
        console.error("Format data tidak sesuai atau kosong:", data);
      }
    })
    .catch((error) => console.error("Gagal mengambil data:", error));

  // Event listener untuk mengisi NIP otomatis ketika Nama dipilih
  namaSelect.on("change", function () {
    let selectedOption = $(this).find(":selected");
    nipInput.val(selectedOption.data("nip") || ""); // Ambil NIP dari dataset
    console.log("NIP yang dipilih:", nipInput.val());
  });
});

function refreshPage() {
  location.reload();
}
