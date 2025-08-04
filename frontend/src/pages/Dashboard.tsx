import { CryptocurrenciesListar } from "../app/components/CryptocurrenciesListar";

export const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <div className="container py-5">                
            <CryptocurrenciesListar></CryptocurrenciesListar>
            </div>
        </div>
    );
}