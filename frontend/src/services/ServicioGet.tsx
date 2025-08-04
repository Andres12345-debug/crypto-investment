export class ServicioGet {
    public static async peticionGet(urlServicio: string): Promise<any> {
        try {
            const response = await fetch(urlServicio, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en la petición GET:', error);
            throw error;
        }
    }
}