import './App.css';
import DataTable from './components/DetailDataTable/DataTable';


const inputData = [
  {
      "id": 6873,
      "code": "BH-L1056",
      "title": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur, mollitia ipsum labore corporis nesciunt voluptatum sint sed soluta sapiente ad!",
      "loanNumber": "5743/OC-BH",
      "field1": "160000000.00",
      "field2": "160000000.00",
      "field3": "100.000000",
      "field4": "0.00",
      "field5": "0.00",
      "field6": "3",
      "field7": "SERGIO LACAMBRA AYUSO",
      "field8": "2024-05-04",
      "field9": "RND",
      "field10": "0",
      "field11": "BH",
      "field12": "Not applicable",
      "frontendId": "581-21"
  },
  {
      "id": 6874,
      "code": "BH-L1057",
      "title": "Strengthening Disaster",
      "loanNumber": "5744/OC-BH",
      "field1": "20000000.00",
      "field2": "60000000.00",
      "field3": "200.000000",
      "field4": "0.00",
      "field5": "0.00",
      "field6": "3",
      "field7": "SERGIO LACAMBRA AYUSO",
      "field8": "2024-05-04",
      "field9": "RND",
      "field10": "0",
      "field11": "BH",
      "field12": "Not applicable",
      "frontendId": "581-21"
  },
]
const headers = ["Proyecto", "Operacion", "Nombre", "Jefe de proyecto", "Date", "Id"]
const selectedKeys = ["code", "loanNumber", "title", "field7", "field8" ,"id"]

function App() {
  return (
    <div className="App">
      <DataTable headers={headers} selectedKeys={selectedKeys} inputData={inputData} hasFirsColLink/>
    </div>
  );
}

export default App;
