import { Injectable } from "@angular/core";
import { OrdemDeServico } from "../models/ordemdeservico.model";
import { DatabaseService } from "./database.services";
import { databaseName } from "./database.statements";


@Injectable({
    providedIn: 'root'
})

export class OrdensDeServicoService {

    constructor(
        private databaseService: DatabaseService
    ) { }

    public async getAll() {
        const db = await this.databaseService.sqliteConnection.retrieveConnection(databaseName, false);
        db.open();
        let returnQuery = await db.query("SELECT * FROM ordensdeservico;");
        let ordensdeservico: OrdemDeServico[] = [];
        if (returnQuery.values!.length > 0) {
            for(let i = 0; i < returnQuery.values!.length; i++) {
                const ordemdeservico = returnQuery.values![i];
                console.log(`OS> ${ordemdeservico}`);
                ordensdeservico.push(ordemdeservico);
            }
        }
        return ordensdeservico;
    }
    public async getById(id: string): Promise<any> {
        try {
            const db = await this.databaseService.sqliteConnection.
            retrieveConnection(databaseName, false);
            const sql = 'select * from ordensdeservico where ordemdeservicoid =  ?';
            try {
                db.open();
                const data = await db.query(sql, [id]);
                db.close();
                if(data.values!.lenght > 0) {
                    const ordemdeservico: OrdemDeServico = data.values![0];
                    ordemdeservico.dataehoraentrada = new Date(ordemdeservico.dataehoraentrada);
                    return ordemdeservico;
                } else {
                    return null;
                }
            }catch (e) {
                return console.error(e);
            }
        }catch (e) {
            return console.error(e);
        }
    }
    async update (ordemDeServico: OrdemDeServico): Promise<void> {
        let sql: any;
        let param: any;
        if (Guid.parse(ordemDeServico.ordemdeservicoid).isEmpty()){
            ordemDeServico.ordemdeservicoid= Guid.create(). toString();
            sql = 'INSERT INTO ordemdeservico(ordemdeservicoid, clienteid, veiculo, dataehoraentrada)'+'values(?,?,?,?)';
            param = [ordemDeServico.ordemdeservicoid, ordemDeServico.clienteid, ordemDeServico.veiculo,ordemDeServico.dataehora];
        } else {
            sql = 'UPDATE ordensdeservico SET clienteid = ?, veiculo = ?,' +'dataehoraetrada = ? WHERE ordemdeservicoid = ?';
            param = [ordemDeServico.clienteid, ordemDeServico.veiculo, ordemDeServico.dataehoraentrada, ordemDeServico.ordemdeservicoid];
        }
        try {
            const db = await this.databaseService.sqliteConnection.retrieveConnection(databaseName,, false);
            db.open ();
            await db.run(sql, param);
            db.close();
        } catch (e) {
            console.error(e);
        }
    }
    iniciarEdicao() {
        this.modoDeEdicao = true;
    }
    cancelarEdicao() {
        this.osForm.setValue(this.ordemDeServico);
        this.modoDeEdicao = false;
    }
    async submit() {
        if (this.osForm.invalid || this.osForm.pending) {
            await TipoServicosAddEditPage.alertService.presentAlert('Falha', 'Gravação não foi executada','Verifique os dados informados para o atendimento',['Ok']);
            return;
        }
    
    const dataString= new Date(this.osForm.controls['dataentrada'].value).toDateString();
    const horaString = new Date (this.osForm.controls['horaentrada'].value).toTimeString();
    const dataEHora = new Date( dataString +''+ horaString);
    await this.ordensDeServicoService.update(
    ordemdeservicoid: this.osForm.controls['ordemdeservicoid'].value,
    clienteid: this.osForm.controls['clienteid'].value,
    veiculo: this.osForm.controls['veiculo'].value,
    dataehoraentrada: dataEHora,
    );
    this.toastService.presentToast('Gravação bem sucedida', 3000, 'top');
    this.router.navigateBuyUrl('ordensdeservico-listagem)');
    }
}