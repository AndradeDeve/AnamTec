import Header from './components/Header/Header';
import AccessFilters from "./components/FilterAcess/FilterAcess";
import Table from './components/AcessTable/AcessTable'
import './ControllAcess.css'
const ControllAcess = () => {
    return (
     <div className="">
        <Header />
      <div className="flex-grow-1">
          
        <div className="container mt-5">
          <AccessFilters />
          <Table />
        </div>
      </div>
    </div>
    )

}

export default ControllAcess