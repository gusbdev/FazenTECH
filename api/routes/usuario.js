const express = require('express');
const { route } = require('../app');
const router = express.Router();
const mysql = require('../mysql').pool;
const email = require('../email');

router.post('/login',(req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error){return res.status(500).send({ error:error }) }

        var resu = false;

        if(req.body.email == null || req.body.senha == null){
            return res.status(404).send({
                response:"preencha os dados corretamente"
            });
        }

        conn.query(
            'SELECT * FROM usuario WHERE lower(email) like lower(?) and senha like ?',
            [req.body.email,req.body.senha],
            (error,resultado,fields) => {
                let nome, email;
                if(error){return res.status(500).send({ error:error }) }
                
                if(resultado.length > 0){
                    resu = true;
                    nome = resultado[0].nome;
                    email = resultado[0].email;
                }

                return res.status(200).send({
                    response:resu,
                    email: email,
                    nome: nome,
                });
            }
        );
    });
});

router.post('/',(req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error){return res.status(500).send({ error:error }) }

        if(req.body.email == null || req.body.senha == null || req.body.nome == null){
            return res.status(404).send({
                response:"preencha os dados corretamente"
            });
        }

        conn.query(
            'INSERT INTO usuario(email,nome,senha) VALUES(?,?,?)',
            [req.body.email,req.body.nome,req.body.senha],
            (error,resultado,fields) => {
                if(error){
                    return res.status(500).send({
                        error:error,
                        response:null
                    });
                }

                res.status(201).send({
                    mensagem:'Cadastrado com sucesso.',
                    id_usuario: resultado.insertId
                });
            }
        );
    });
});

router.post('/finalizar',async(req,res,next) => {
    if(req.body.usuario == null){
        return res.status(404).send({
            response:"preencha os dados corretamente"
        });
    }

    var usuario = req.body.usuario;
    var produtos = req.body.produtos;
    var corpo = 'Prezado '+usuario.nome+', seu pedido foi finalizado com sucesso.<br/><br/><b>Produtos:</b><br/>';

    produtos.forEach(prod => {
        corpo += "Nome: "+prod.nome+"<br/>";
        corpo += "Preço: "+prod.preco+"<br/>";
        corpo += "Descrição: "+prod.descricao+"<br/><br/>";
    });

    var error = await email.enviaEmail(usuario.email,'Pedido finalizado',corpo);

    if(error != null){
        return res.status(500).send({
            response:error
        });
    }

    return res.status(201).send({
        response:"enviado com sucesso"
    });
});

module.exports = router;