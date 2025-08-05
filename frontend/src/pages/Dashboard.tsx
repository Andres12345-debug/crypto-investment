import { CryptocurrenciesListar } from "../app/components/CryptocurrenciesListar";

export const Dashboard = () => {
    return (
        <div>
            <h1>CryptoInvestment</h1>
            <div className="container">                
            <CryptocurrenciesListar></CryptocurrenciesListar>
            </div>
        </div>
    );
}