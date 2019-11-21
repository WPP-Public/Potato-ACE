context('Listbox', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should exist', () => {
        expect(cy.get('#listbox')).to.exist;
    });

    it('should assign the role="listbox" to the <ul>', () => {
        cy.get('#listbox').should('have.attr', 'role', 'listbox');
    });

    it('should have tab-index=0', () => {
        cy.get('#listbox').should('have.attr', 'tabindex', '0');
    });

    it('should not override an existing tabindex', () => {
        cy.get('#multi-selectable-listbox').should('have.attr', 'tabindex', '1');
    });

    it('should assign the role="option" to the <li>', () => {
        cy.get('#listbox>li').should('have.attr', 'role', 'option');
    });

    it('should not override an existing <li> id', () => {
        expect(cy.get('#iron-man')).to.exist;
    });
});