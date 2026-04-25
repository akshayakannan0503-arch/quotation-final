let data = {};

function calc() {

  const h = +house.value;

  const s = +sup.value;

  const total = h + s;

  const gst = total * 0.18;

  const grand = total + gst;

  data = {

    clientName: client.value,

    address: addr.value,

    housekeeping: h,

    supervisor: s,

    total: total,

    gst: gst,

    grandTotal: grand,

    date: new Date().toLocaleDateString()

  };

  alert("Grand Total: ₹" + grand);

}

async function save() {

  await fetch("/save", {

    method: "POST",

    headers: {"Content-Type":"application/json"},

    body: JSON.stringify(data)

  });

}

async function pdf() {

  const res = await fetch("/pdf", {

    method: "POST",

    headers: {"Content-Type":"application/json"},

    body: JSON.stringify(data)

  });

  const blob = await res.blob();

  window.open(URL.createObjectURL(blob));

}
