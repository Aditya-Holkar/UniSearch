import { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [first, setFirst] = useState([]);
  const [lst, setLst] = useState("");
  const fet = async () => {
    const bc = await axios.get(
      `https://universities.hipolabs.com/search?country=${lst}`,
    );
    setFirst(bc.data);
    // console.log(bc.data[0]);
  };

  // if (!first) return <h1>No data</h1>;

  //  use https://data.cityofnewyork.us/resource/erm2-nwe9.json?city=NEW+YORK this as well
  //  https://openlibrary.org/dev/docs/api
  // https://wolnelektury.pl/api/

  const search = (e) => {
    fet();
  };

  // useEffect(() => {
  //   fet();
  // }, [lst]);

  const collegeList = (
    <div>
      <table className="border border-collapse min-w-full table-auto">
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Country</th>
            <th>Code</th>
            <th>Links</th>
            <th>Name</th>
            <th>State/Province</th>
            <th>Websites</th>
          </tr>
        </thead>
        <tbody>
          {first ? (
            first.map(function (params, idx) {
              return (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{params.country}</td>
                  <td>{params.alpha_two_code}</td>
                  <td>
                    <a
                      href={"https://" + params.domains[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {params.domains[0]}
                    </a>
                  </td>
                  <td>{params.name}</td>
                  <td>{params["state-province"] ?? null}</td>
                  <td>{params.web_pages}</td>
                </tr>
              );
            })
          ) : (
            <h1>data is loding</h1>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <button className="bg-amber-100" onClick={fet}>
        click
      </button>
      <input
        className="m-4 border border-collapse"
        type="text"
        onChange={(e) => setLst(e.target.value)}
      />
      <span className="p-2 bg-amber-600" onClick={search}>
        search
      </span>
      {/* alpha_two_code
: 
"GR"
country
: 
"Greece"
domains
: 
['noah.edu.gr']
name
: 
"Hellenic College of Noah"
state-province
: 
"Macedonia"
web_pages
: 
['https://noah.edu.gr'] */}
      <div>{collegeList}</div>
    </>
  );
}

export default App;
